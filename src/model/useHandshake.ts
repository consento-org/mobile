import { useContext } from 'react'
import { Buffer } from 'buffer'
import { IConnection, IEncodable, IHandshakeAcceptMessage, IHandshakeConfirmation, cancelable, CancelError, ICancelable, IHandshakeInit, IHandshakeAccept } from '@consento/api'
import { bufferToString } from '@consento/crypto/util/buffer'
import { useStateMachine, IStateMachine, IState } from '../util/useStateMachine'
import { ConsentoContext, Consento } from './Consento'

function isAcceptMessage (body: IEncodable): body is IHandshakeAcceptMessage {
  if (typeof body === 'object' && !(body instanceof Uint8Array)) {
    // eslint-disable-next-line dot-notation
    return typeof body['token'] === 'string' && typeof body['secret'] === 'string'
  }
  return false
}

function isUint8Array (body: IEncodable): body is Uint8Array {
  return body instanceof Uint8Array
}

const initRegExp = /^consento:\/\/connect:((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/g

export function isInitLink (url: string): boolean {
  initRegExp.lastIndex = 0
  return initRegExp.test(url)
}

export function getInitMessage (url: string): Buffer | null {
  initRegExp.lastIndex = 0
  const result = initRegExp.exec(url)
  if (result === null) {
    return null
  }
  return Buffer.from(result[1], 'base64')
}

export enum OutgoingState {
  idle = 'idle',
  connecting = 'connecting',
  confirming = 'confirming'
}

export enum IncomingState {
  init = 'init',
  ready = 'ready',
  confirming = 'confirming'
}

type InitData = [ (connection: IConnection) => any, Consento]

function incomingMachine (
  updateState: (state: IncomingState, ops?: string) => void,
  reset: () => void,
  [onHandshake, { crypto, notifications }]: InitData
): IStateMachine<IncomingState, any> {
  const incoming = cancelable<IConnection>(function * (child) {
    const incoming = (yield crypto.initHandshake()) as IHandshakeInit
    const { afterSubscribe: receive } = (yield child(notifications.receive(incoming.receiver, isAcceptMessage))) as { afterSubscribe: ICancelable<IHandshakeAcceptMessage> }
    const link = `consento://connect:${bufferToString(incoming.firstMessage, 'base64')}`
    updateState(IncomingState.ready, link)
    const acceptMessage: IHandshakeAcceptMessage = yield child(receive)
    updateState(IncomingState.confirming, link)
    const confirmation: IHandshakeConfirmation = yield child(incoming.confirm(acceptMessage))
    yield notifications.send(confirmation.connection.sender, confirmation.finalMessage)
    return confirmation.connection
  }).then(
    onHandshake,
    (error: Error) => {
      if (error instanceof CancelError) {
        return
      }
      console.log({
        message: 'Error incoming handshake'
      })
      console.error(error)
      setTimeout(reset, 1000)
    }
  )
  return {
    initialState: IncomingState.init,
    setState: (): boolean => false, // Only internally changable
    close: incoming.cancel
  }
}

function outgoingMachine (
  updateState: (state: OutgoingState, ops?: any) => void,
  reset: () => void,
  [onHandshake, { crypto, notifications }]: InitData
): IStateMachine<OutgoingState, any> {
  let formerAcceptLink
  let outgoing: ICancelable<IConnection>
  const close = (): void => {
    if (outgoing !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      outgoing.cancel()
      outgoing = undefined
    }
  }
  return {
    initialState: OutgoingState.idle,
    setState: (state: OutgoingState, ops?: any): boolean => {
      if (state === OutgoingState.connecting) {
        if (typeof ops !== 'string') {
          return false
        }
        const acceptLink = ops
        if (acceptLink === formerAcceptLink) {
          return false
        }
        const initMessage = getInitMessage(acceptLink)
        if (initMessage === null) {
          return false
        }
        close()
        formerAcceptLink = acceptLink
        const thisOutgoing = cancelable<IConnection>(function * (child) {
          const accept = (yield crypto.acceptHandshake(initMessage)) as IHandshakeAccept
          const { afterSubscribe: receive } = (yield child(notifications.receive(accept.receiver))) as { afterSubscribe: ICancelable<IEncodable>}
          yield notifications.send(accept.sender, accept.acceptMessage)
          updateState(OutgoingState.confirming)
          const finalMessage = yield child(receive)
          if (!isUint8Array(finalMessage)) {
            throw new Error('finalization is supposed to be an uint8 array')
          }
          return (yield accept.finalize(finalMessage)) as unknown as IConnection
        })
        outgoing = thisOutgoing
        thisOutgoing.then(
          onHandshake,
          error => {
            if (error instanceof CancelError) {
              return
            }
            console.log({
              message: 'Error outgoing handshake'
            })
            console.error(error)
            setTimeout(reset, 1000)
          })
        return true
      }
      return false
    },
    close
  }
}

export function useHandshake (onHandshake: (connection: IConnection) => any): {
  incoming: IState<IncomingState, any>
  outgoing: IState<OutgoingState, any>
  connect (initLink: string): void
} {
  const api = useContext(ConsentoContext)
  api.assertReady()
  const stateOps = [onHandshake, api]
  const [incoming] = useStateMachine(incomingMachine, stateOps)
  const [outgoing, outgoingManager] = useStateMachine(outgoingMachine, stateOps)
  return {
    incoming,
    outgoing,
    connect (initLink: string): void {
      outgoingManager.setState(OutgoingState.connecting, initLink)
    }
  }
}
