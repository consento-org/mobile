import { IAPI, ISuccessNotification } from '@consento/api'
import { Receiver } from './Connection'
import { ISubscriptionMap } from './Consento.types'

export function mapSubscriptions<T> (
  items: Iterable<T>,
  getReceiver: (item: T) => Receiver,
  action: (item: T, notification: ISuccessNotification, api: IAPI) => void
): ISubscriptionMap {
  const subscriptions: ISubscriptionMap = {}
  for (const item of items) {
    const receiver = getReceiver(item)
    if (receiver !== null && receiver !== undefined) {
      subscriptions[receiver.id] = {
        receiver,
        action: action.bind(null, item)
      }
    }
  }
  return subscriptions
}
