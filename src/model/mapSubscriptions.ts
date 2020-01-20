import { IAPI, ISuccessNotification } from '@consento/api'
import { Receiver } from './Connection'
import { ISubscription } from './Consento.types'

export function mapSubscriptions<T> (items: Iterable<T>, getReceiver: (item: T) => Receiver, action: (item: T, notification: ISuccessNotification, api: IAPI) => void): { [receiveKey: string]: ISubscription } {
  const subscriptions: { [key: string]: ISubscription } = {}
  for (const item of items) {
    const receiver = getReceiver(item)
    subscriptions[receiver.receiveKey] = {
      receiver,
      action: action.bind(null, item)
    }
  }
  return subscriptions
}
