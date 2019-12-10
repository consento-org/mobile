import { useEffect, useState, useContext } from 'react'
import { IHandshakeInit, IReceiver, IEncodable, IHandshakeAcceptMessage, IHandshakeConfirmation } from '@consento/crypto'
import { ConsentoContext } from './ConsentoContext'

function isAcceptMessage (body: IEncodable): body is IHandshakeAcceptMessage {
  if (typeof body === 'object' && !(body instanceof Uint8Array)) {
    return typeof body['token'] === 'string' && typeof body['secret'] === 'string'
  }
  return false
}

function isUint8Array (body: IEncodable): body is Uint8Array {
  return body instanceof Uint8Array
}

export function useHandshake () {
  const {
    crypto,
    notifications
  } = useContext(ConsentoContext)
  const [ parts, setHandshake ] = useState<{
    handshake?: IHandshakeInit,
    initMessage?: string
  }>({})

  const [ connectionState, setConnectionState ] = useState<string>('no-connection')
  const [ refresh, setRefresh ] = useState<number>(Date.now())
  const [ closeIncoming, setCloseIncoming ] = useState<() => any>(null)
  const [ closeOutgoing, setCloseOutgoing ] = useState<() => any>(null)

  useEffect(() => {
    if (crypto !== null) {
      const handshake = new crypto.HandshakeInit()
      handshake.initMessage().then((data: Buffer) => {
        setHandshake({
          handshake,
          initMessage: data.toString('base64')
        })
        /*
        const { promise, cancel } = notifications.receive(handshake.receiver, isAcceptMessage)
        if (closeIncoming !== null) {
          closeIncoming() //
        }
        setCloseIncoming(cancel)
        promise.then(acceptMessage => {
          setConnectionState('confirming-incoming')
          return handshake.confirm(acceptMessage).then(confirmation => {
            return notifications.send(confirmation.sender, confirmation.finalMessage)
              .then(() => {
                console.log('done incoming', confirmation)
              })
          })
        })
        */
      }).catch(err => {
        console.log(`Error getting handshake`)
        console.log(err)
      })
    }
    return () => {
      if (closeIncoming !== null) {
        closeIncoming()
      }
      if (closeOutgoing !== null) {
        closeOutgoing()
      }
    }
  }, [refresh, crypto])

  return {
    connectionState,
    connect (initMessage: string) {
      if (crypto !== null) {
        const accept = new crypto.HandshakeAccept(Buffer.from(initMessage, 'base64'))
        setConnectionState('connecting')
        /*
        const { promise, cancel } = notifications.sendAndReceive(accept, accept.acceptMessage, isUint8Array)
        if (closeOutgoing !== null) {
          closeOutgoing()
        }
        setCloseOutgoing(cancel)
        promise.then(finalMessage => accept.finalize(finalMessage) 
          .then(done => {
            console.log('done outgoing', done)
          })
        )
        */
      }
    },
    initMessage: parts.initMessage,
    refresh () {
      setRefresh(Date.now())
    }
  }
}
