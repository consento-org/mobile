import { computed, observable, autorun } from 'mobx'
import { Model, model, tProp, types, prop, arraySet, ArraySet, modelAction, registerRootStore, unregisterRootStore } from 'mobx-keystone'
import { createContext } from 'react'
import { AsyncStorage, AppStateStatus, AppState } from 'react-native'
import { setup, IAPI, INotifications, IConsentoCrypto, INotification } from '@consento/api'
import { ExpoTransport } from '@consento/notification-server'
import isURL from 'is-url-superb'
import { User, createDefaultUser } from './User'
import { getExpoToken } from '../util/getExpoToken'
import { Notifications } from 'expo'
import { Notification } from 'expo/build/Notifications/Notifications.types'
import { cryptoCore } from '../cryptoCore'
import { rimraf } from '../util/expoRimraf'
import { first } from '../util/first'
import { combinedDispose } from '../util/combinedDispose'
import { vaultStore } from './VaultStore'
import { IConsentoModel, CONSENTO, ISubscription, ISubscriptionMap } from './Consento.types'
import { safeReaction } from '../util/safeReaction'
import { bufferToString } from '@consento/crypto/util/buffer'

export const ConsentoContext = createContext<Consento>(null)

const DEFAULT_ADDRESS = '//notify.consento.org'
const CONFIG_ITEM_KEY = '@consento/config'

async function loadConfig (): Promise<any> {
  return JSON.parse((await AsyncStorage.getItem(CONFIG_ITEM_KEY)) ?? '{}')
}

async function saveConfig (newConfig: IConfig): Promise<void> {
  await AsyncStorage.setItem(CONFIG_ITEM_KEY, JSON.stringify(newConfig))
}

interface IConfig {
  address?: string
}

interface IHackAPI extends IAPI {
  notificationTransport: ExpoTransport
}

interface IEventSubscription {
  remove (): void
}

@model('consento/Config')
export class Config extends Model({
  address: tProp(types.nonEmptyString, () => DEFAULT_ADDRESS)
}) {}

function assertConfig (config: any): asserts config is IConfig {
  if (typeof config !== 'object') {
    throw new Error('config must be an object')
  }
  if (config.address === null || config.address === undefined) {
    return
  }
  if (typeof config.address !== 'string') {
    throw new Error('config.address must be a string')
  }
  if (!isURL(config.address)) {
    throw new Error('config.address needs to be a valid URI')
  }
}

function createTransport (address: string): {
  notificationTransport: ExpoTransport
  destructTransport: () => void
} {
  if (/^\/\//.test(address)) {
    address = `https://${address}`
  }
  const notificationTransport = new ExpoTransport({
    address,
    getToken: getExpoToken
  })
  notificationTransport.on('error', (error) => {
    console.log({ transportError: error })
  })
  let cancel: () => void
  const stateChange = (state: AppStateStatus): void => {
    if (state !== 'background') {
      if (cancel === undefined) {
        cancel = notificationTransport.connect()
      }
    } else {
      if (cancel !== undefined) {
        cancel()
        cancel = undefined
      }
    }
  }
  AppState.addEventListener('change', stateChange)
  stateChange(AppState.currentState)
  return {
    notificationTransport,
    destructTransport: () => {
      AppState.removeEventListener('change', stateChange)
      stateChange('inactive')
    }
  }
}

function diffSubscriptions (stored: ISubscriptionMap, current: ISubscriptionMap): { newSubscriptions: ISubscription[], goneSubscriptions: ISubscription[] } {
  const newSubscriptions = []
  const goneReceiveKeys = new Set(Object.keys(stored))
  for (const receiveKey in current) {
    const subscription = current[receiveKey]
    if (stored[receiveKey] === undefined) {
      newSubscriptions.push(subscription)
    } else {
      goneReceiveKeys.delete(receiveKey)
    }
    // TODO: This logic works but it hard to remember and easy to mistake
    // Replace the internal handler with the current subscription, not need to inform the subscription system
    stored[receiveKey] = subscription
  }
  const goneSubscriptions = Array.from(goneReceiveKeys).map(receiveKey => {
    const subscription = stored[receiveKey]
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete stored[receiveKey]
    return subscription
  })
  return {
    newSubscriptions,
    goneSubscriptions
  }
}

@model(CONSENTO)
export class Consento extends Model({
  users: prop<ArraySet<User>>(() => arraySet()),
  config: prop<Config>(() => null)
}) implements IConsentoModel {
  _apiReady = observable.box(Date.now())
  _api: IHackAPI

  onInit (): void {
    this.deleteEverything = this.deleteEverything.bind(this)
    this.updateConfig = this.updateConfig.bind(this)
    loadConfig()
      .then(config => this._setConfig(config))
      .catch(error => {
        this.updateConfig({})
        console.log({ loadConfigError: error })
      })
  }

  assertReady (): void {
    if (!this.ready) {
      throw new Error('API not ready!')
    }
  }

  @computed get api (): IAPI {
    this._apiReady.get()
    return this._api
  }

  @modelAction _setConfig (config: any): void {
    assertConfig(config)
    this.config = new Config(config)
  }

  updateConfig (config: IConfig): void {
    this._setApi(undefined)
    this._setConfig(config)
    saveConfig(config)
      .then(
        () => console.log('config saved'),
        error => console.log({ saveConfigError: error })
      )
  }

  @computed get user (): User {
    return first(this.users)
  }

  @computed get notifications (): INotifications {
    return this.api?.notifications
  }

  @computed get crypto (): IConsentoCrypto {
    return this.api?.crypto
  }

  @computed get ready (): boolean {
    if (this.api === undefined) {
      return false
    }
    if (this.user === undefined) {
      return false
    }
    return this.user.loaded
  }

  @modelAction _setApi (api: IHackAPI): void {
    this.users.clear()
    this._api = api
    this._apiReady.set(Date.now())
    if (this._api !== undefined && first(this.users) === undefined) {
      this.users.add(createDefaultUser())
    }
  }

  deleteEverything (): void {
    const api = this._api
    this._setApi(undefined)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    rimraf('').finally(() => this._setApi(api))
  }

  onAttachedToRootStore (): () => void {
    registerRootStore(vaultStore)
    return combinedDispose(
      () => unregisterRootStore(vaultStore),
      safeReaction(
        () => ({ ready: this.ready, user: this.user }),
        ({ ready, user }) => {
          if (!ready) return
          const subscriptions = {
            ...user.subscriptions
          }
          const processor = (message: INotification, encryptedMessage?: any): void => {
            if (message.type === 'success') {
              const subscription = subscriptions[message.channelIdBase64]
              if (subscription === undefined) {
                console.log(`Received notification for ${message.channelIdBase64} but there was no subscriber ${String(encryptedMessage)}?!`)
                return
              }
              console.log(`Received notification: ${message.channelIdBase64}`)
              subscription.action(message, this.api)
            } else {
              console.log({ errorNotification: message })
            }
          }
          const api = this._api
          api.notifications.processors.add(processor)
          const receivers = Object.values(subscriptions).map(subscription => new api.crypto.Receiver(subscription.receiver))
          console.log(`Resetting:\n  ${receivers.map(receiver => bufferToString(receiver.id, 'base64')).join('\n  ')}`)
          let expoSubscription: IEventSubscription
          api.notifications
            .reset(receivers)
            .then(
              () => {
                expoSubscription = Notifications.addListener((notification: Notification): void => {
                  api.notificationTransport.handleNotification(notification)
                })
              },
              notificationResetError => {
                console.log('Error resetting the notifications')
                console.log({ notificationResetError })
              }
            )
          return combinedDispose(
            () => {
              if (expoSubscription !== undefined) expoSubscription.remove()
              api.notifications.processors.delete(processor)
            },
            autorun(() => {
              const { newSubscriptions, goneSubscriptions } = diffSubscriptions(subscriptions, user.subscriptions)
              if (newSubscriptions.length > 0) {
                const receivers = newSubscriptions.map(subscription => new api.crypto.Receiver(subscription.receiver))
                console.log(`Subscribing:\n  ${receivers.map(receiver => bufferToString(receiver.id, 'base64')).join('\n  ')}`)
                this.api.notifications
                  .subscribe(receivers)
                  .catch(subscribeError => {
                    for (const subscription of newSubscriptions) {
                      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                      delete subscriptions[subscription.receiver.receiveKey]
                    }
                    console.log({ subscribeError })
                  })
              }
              if (goneSubscriptions.length > 0) {
                const receivers = goneSubscriptions.map(subscription => new api.crypto.Receiver(subscription.receiver))
                console.log(`Unsubscribing:\n  ${receivers.map(receiver => bufferToString(receiver.id, 'base64')).join('\n  ')}`)
                this.api.notifications
                  .unsubscribe(receivers)
                  .catch(unsubscribeError => {
                    for (const subscription of goneSubscriptions) {
                      subscriptions[subscription.receiver.receiveKey] = subscription
                    }
                    console.log({ unsubscribeError })
                  })
              }
            })
          )
        }
      ),
      safeReaction(
        () => this.config?.address,
        address => {
          if (address === undefined || address === null) {
            return
          }
          const { notificationTransport, destructTransport } = createTransport(address)
          const api = setup({
            cryptoCore,
            notificationTransport
          })
          this._setApi({
            ...api,
            notificationTransport
          })
          return () => {
            this._setApi(undefined)
            destructTransport()
          }
        }
      )
    )
  }
}
