import { useEffect, useState, useContext } from 'react'
import { IHandshakeInit, IEncodable, IHandshakeAcceptMessage } from '@consento/crypto'
import { ConsentoContext } from './ConsentoContext'
import { Buffer } from 'buffer'
import { IConnection } from '@consento/api'

function isAcceptMessage (body: IEncodable): body is IHandshakeAcceptMessage {
  if (typeof body === 'object' && !(body instanceof Uint8Array)) {
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

export enum ConnectionState {
  noConnection = 'no-connection',
  connecting = 'connecting',
  confirmIncoming = 'confirm-incoming'
}

export function useHandshake (onHandshake: (connection: IConnection) => any) {
  const {
    crypto,
    notifications
  } = useContext(ConsentoContext)
  const [ parts, setHandshake ] = useState<{
    handshake?: IHandshakeInit,
    initLink?: string
  }>({})

  const [ connectionState, setConnectionState ] = useState<string>(ConnectionState.connecting)
  const [ refresh, setRefresh ] = useState<number>(Date.now())
  const [ close ] = useState<{
    outgoing: () => any
    incoming: () => any
  }>({} as any)

  useEffect(() => {
    if (crypto !== null) {
      const handshake = new crypto.HandshakeInit()
      handshake.initMessage().then(async (data: Buffer) => {
        setHandshake({
          handshake,
          initLink: `consento://connect:${data.toString('base64')}`
        })
        const { promise, cancel } = await notifications.receive(handshake.receiver, isAcceptMessage)
        if (close.incoming !== undefined) {
          close.incoming()
        }
        close.incoming = cancel
        try {
          const acceptMessage = await promise
          setConnectionState(ConnectionState.confirmIncoming)
          const confirmation = await handshake.confirm(acceptMessage)
          await notifications.send(confirmation.sender, confirmation.finalMessage)
          onHandshake(confirmation)
        } catch (err) {
          if (err.message !== 'cancelled') {
            console.error(err)
          }
        }
      }).catch(error => {
        console.log({
          message: `Error getting handshake`,
          error: error.stack || error
        })
      })
    }
    return () => {
      if (close.incoming !== undefined) {
        close.incoming()
      }
      if (close.outgoing !== undefined) {
        close.outgoing()
      }
    }
  }, [refresh, crypto])

  return {
    connectionState,
    connect (initLink: string) {
      (async () => {
        const initMessage = getInitMessage(initLink)
        if (crypto !== null && initMessage !== null) {
          const accept = new crypto.HandshakeAccept(initMessage)
          setConnectionState(ConnectionState.connecting)
          const { promise, cancel } = await notifications.receive(accept.receiver)
          if (close.outgoing !== undefined) {
            close.outgoing()
          }
          close.outgoing = cancel
          const msg = await accept.acceptMessage()
          await notifications.send(accept.sender, msg)
          const finalMessage = await promise
          if (!isUint8Array(finalMessage)) {
            throw new Error('finalization is supposed to be an uint8 array')
          }
          const done = await accept.finalize(finalMessage)
          onHandshake(done)
        }
      })()
        .catch(err => {
          if (err.message !== 'cancelled') {
            console.error(err)
          }
        })
    },
    initLink: parts.initLink,
    refresh () {
      setRefresh(Date.now())
    }
  }
}
