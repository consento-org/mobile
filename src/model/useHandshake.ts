import { useEffect, useState, useContext } from 'react'
import { IHandshakeInit, IEncodable, IHandshakeAcceptMessage } from '@consento/crypto'
import { ConsentoContext } from './ConsentoContext'
import { Buffer } from 'buffer'

function isAcceptMessage (body: IEncodable): body is IHandshakeAcceptMessage {
  console.log({ received: body })
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

export function useHandshake () {
  const {
    crypto,
    notifications
  } = useContext(ConsentoContext)
  const [ parts, setHandshake ] = useState<{
    handshake?: IHandshakeInit,
    initLink?: string
  }>({})

  const [ connectionState, setConnectionState ] = useState<string>('no-connection')
  const [ refresh, setRefresh ] = useState<number>(Date.now())
  const [ close ] = useState<{
    outgoing: () => any
    incoming: () => any
  }>({} as any)

  useEffect(() => {
    if (crypto !== null) {
      const handshake = new crypto.HandshakeInit()
      handshake.initMessage().then((data: Buffer) => {
        setHandshake({
          handshake,
          initLink: `consento://connect:${data.toString('base64')}`
        })
        const { promise, cancel } = notifications.receive(handshake.receiver, isAcceptMessage)
        if (close.incoming !== undefined) {
          close.incoming()
        }
        close.incoming = cancel
        promise.then(acceptMessage => {
          setConnectionState('confirming-incoming')
          return handshake.confirm(acceptMessage).then(confirmation => {
            return notifications.send(confirmation.sender, confirmation.finalMessage)
              .then(() => {
                console.log('done incoming', confirmation)
              })
          })
        }).catch(err => {
          if (err.message !== 'cancelled') {
            console.error(err)
          }
        })
      }).catch(err => {
        console.log(`Error getting handshake`)
        console.log(err)
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
          setConnectionState('connecting')
          const { promise, cancel } = notifications.sendAndReceive(accept, await accept.acceptMessage(), isUint8Array)
          if (close.outgoing !== undefined) {
            close.outgoing()
          }
          close.outgoing = cancel
          try {
            const finalMessage = await promise
            const done = await accept.finalize(finalMessage)
            console.log('done outgoing', done)
          } catch (err) {
            if (err.message !== 'cancelled') {
              console.error(err)
            }
          }
        }
      })()
        .catch(err => {
          console.error(err)
        })
    },
    initLink: parts.initLink,
    refresh () {
      setRefresh(Date.now())
    }
  }
}
