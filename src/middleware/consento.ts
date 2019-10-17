import { isSubmit, message, setActive, IAction } from '../actions'
import { setup, IAPI, ISender, IReceiver } from '@consento/api'
import { sodium as cryptoCore } from '@consento/crypto/core/sodium'
import { ExpoTransport } from '@consento/notification-server'
import { getExpoToken as getToken } from '../util/getExpoToken'
import { Notifications } from 'expo'
import { EventSubscription } from 'fbemitter'
import { Middleware, Store, Dispatch } from 'redux'
import { IState } from '../reducers'

const PEOPLE = {
  alice: {
    sendKey: 'nhjQf6u0APJYRE6ujj/kU+s13caEPjIBI/rS56eY6uHlJWyd94TjDaJTeVhATvbl00VPsmyAaAq93rFSMnPVNw=='
  },
  bob: {
    sendKey: 'yAAifyVrwmop3QHxmjfvNf+XzWaOubpQbrKRtEy+Mm4JIoEXUwWZmGDjhC5JaeXE8IIviDK9AH8hoAFv/YkD9Q=='
  }
}

export function consentoMiddleware (store: Store): Middleware<{}, any, Dispatch<IAction>> {
  let api: IAPI
  let transport: ExpoTransport
  let address
  let user: string = 'alice'
  let subscription: EventSubscription
  let receiver: IReceiver
  const senders: { [name: string]: ISender } = {}

  function handleMessage (): void {
    store.dispatch(message(store.getState().message))
  }

  function updateApi (state: IState): IState {
    if (address !== state.server) {
      address = state.server
      if (transport !== undefined) {
        transport.removeListener('message', api.notifications.handle)
        subscription.remove()
        api.notifications.removeListener('message', handleMessage)
        if (receiver !== undefined) {
          api.notifications.unsubscribe([receiver]).then(() => {}, error => { console.log(error) })
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
    if (api !== undefined && (user !== state.user || receiver !== undefined)) {
      if (receiver !== undefined) {
        api.notifications.unsubscribe([receiver]).then(() => {}, error => { console.log(error) })
      }
      user = state.user
      receiver = senders[user]
      if (receiver !== undefined) {
        api.notifications.subscribe([receiver]).then(() => {}, error => { console.log(error) })
      }
    }
    return state
  }

  updateApi(store.getState())

  return next => (action: any): any => {
    if (api !== undefined) {
      if (isSubmit(action)) {
        const sender: ISender = senders[action.target]
        if (sender !== undefined) {
          api.notifications.send(sender, action.message).then(() => {}, error => { console.log(error) })
        }
        return store.getState()
      }
    }
    const result = next(action)
    updateApi(store.getState())
    return result
  }
}
