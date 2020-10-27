import { IAPI, ISuccessNotification } from '@consento/api'
import { Receiver } from './Connection'
import { ISubscriptionMap } from './Consento.types'

export function mapSubscriptions<T> (
  items: Iterable<T>,
  getReceiver: (item: T) => Receiver | undefined | null,
  action: (item: T, notification: ISuccessNotification, api: IAPI) => void
): ISubscriptionMap {
  const subscriptions: ISubscriptionMap = {}
  for (const item of items) {
    const receiver = getReceiver(item)
    if (receiver !== null && receiver !== undefined) {
      subscriptions[receiver.receiveKey] = {
        receiver,
        action: (notification: ISuccessNotification, api: IAPI) => action(item, notification, api)
      }
    }
  }
  return subscriptions
}
