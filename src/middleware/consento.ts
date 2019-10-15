import { isSubmit, message, changeUser, setActive } from '../actions'
import { setup, IAPI, ISender, IReceiver } from '@consento/api'
import { sodium as cryptoCore } from '@consento/crypto/core/sodium'
import { ExpoTransport } from '@consento/notification-server'
import { getExpoToken as getToken } from '../util/getExpoToken'
import { Notifications } from 'expo'
import { EventSubscription } from 'fbemitter'
import { Store } from 'redux'
import { IState } from '../reducers'

const PEOPLE = {
  alice: {
    sendKey: 'nhjQf6u0APJYRE6ujj/kU+s13caEPjIBI/rS56eY6uHlJWyd94TjDaJTeVhATvbl00VPsmyAaAq93rFSMnPVNw=='
  },
  bob: {
    sendKey: 'yAAifyVrwmop3QHxmjfvNf+XzWaOubpQbrKRtEy+Mm4JIoEXUwWZmGDjhC5JaeXE8IIviDK9AH8hoAFv/YkD9Q=='
  }
}

export function consentoMiddleware (store: Store) {
  let api: IAPI
  let transport: ExpoTransport
  let address
  let user: string = 'alice'
  let subscription: EventSubscription
  let receiver: IReceiver
  const senders: { [name: string]: ISender } = {}

  function handleMessage () {
    store.dispatch(message(store.getState().message))
  }

  function updateApi (state) {
    if (address !== state.server) {
      address = state.server
      if (transport) {
        transport.removeListener('message', api.notifications.handle)
        subscription.remove()
        api.notifications.removeListener('message', handleMessage)
        if (receiver) {
          api.notifications.unsubscribe([receiver])
          receiver = undefined
        }
      }
      transport = new ExpoTransport({
        address,
        getToken
      })
      subscription = Notifications.addListener(transport.handleNotification)
      api = setup({
        cryptoCore,
        notificationTransport: transport
      })
      if (!state.active) {
        store.dispatch(setActive(true))
      }
      const { Sender } = api.crypto
      for (const name in PEOPLE) {
        senders[name] = new Sender(PEOPLE[name])
      }
      transport.on('message', (idBase64, msg) => {
        api.notifications.handle(idBase64, msg)
      })
      api.notifications.addListener('message', handleMessage)
    }
    if (api && (user !== state.user || !receiver)) {
      if (receiver) {
        api.notifications.unsubscribe([receiver])
      }
      user = state.user
      receiver = senders[user]
      if (receiver) {
        api.notifications.subscribe([receiver])
      }
    }
    return state
  }

  updateApi(store.getState())
  
  return next => action => {
    if (api) {
      if (isSubmit(action)) {
        const sender: ISender = senders[action.target]
        if (sender) {
          api.notifications.send(sender, action.message)
        }
        return store.getState()
      }
    }
    const result = next(action)
    updateApi(store.getState())
    return result
  }
}
