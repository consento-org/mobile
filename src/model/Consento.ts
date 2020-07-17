import { computed, autorun } from 'mobx'
import { Model, model, tProp, types, prop, arraySet, ArraySet, modelAction } from 'mobx-keystone'
import { createContext } from 'react'
import { AsyncStorage } from 'react-native'
import { setup, IAPI, INotifications, IConsentoCrypto, INotification, EErrorCode } from '@consento/api'
import { ExpoTransport, EClientStatus } from '@consento/notification-server'
import isURL from 'is-url-superb'
import { User, createDefaultUser } from './User'
import { cryptoCore } from '../cryptoCore'
import { systemRimraf } from '../util/systemRimraf'
import { first } from '../util/first'
import { combinedDispose } from '../util/combinedDispose'
import { vaultStore } from './VaultStore'
import { IConsentoModel, CONSENTO, ISubscription, ISubscriptionMap } from './Consento.types'
import { safeReaction } from '../util/safeReaction'
import { bufferToString } from '@consento/crypto/util/buffer'
import { subscribeEvent } from '../util/subscribeEvent'
import { autoRegisterRootStore } from '../util/autoRegisterRootStore'
import { ErrorStrategy } from '@consento/notification-server/client/strategies/ErrorStrategy'

export const ConsentoContext = createContext<Consento>(null)

const DEFAULT_ADDRESS = '//notify-2.consento.org'
const LEGACY_CONFIG_ITEM_KEY = '@consento/config'
const CONFIG_ITEM_KEY = '@consento/config/2'

async function loadConfig (location: string = CONFIG_ITEM_KEY): Promise<any> {
  return JSON.parse((await AsyncStorage.getItem(location)) ?? '{}')
}

async function saveConfig (newConfig: IConfig, location: string = CONFIG_ITEM_KEY): Promise<void> {
  await AsyncStorage.setItem(location, JSON.stringify(newConfig))
}

interface IConfig {
  address?: string
  expire?: number
}

interface IEventSubscription {
  remove (): void
}

@model('consento/Config')
export class Config extends Model({
  address: tProp(types.nonEmptyString, () => DEFAULT_ADDRESS),
  expire: tProp(types.number, () => 600)
}) implements IConfig {}

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
  users: prop<ArraySet<User>>(() => arraySet([createDefaultUser()])),
  legacyConfig: prop<ArraySet<string>>(() => arraySet()),
  transportState: prop(EClientStatus.STARTUP),
  config: prop<Config>(null),
  configLoaded: prop(false)
}) implements IConsentoModel {
  _api: IAPI
  _notificationTransport: ExpoTransport = new ExpoTransport({})
  _configTask: Promise<void>

  onInit (): void {
    this.deleteEverything = this.deleteEverything.bind(this)
    this.updateConfig = this.updateConfig.bind(this)
    this._api = setup({
      cryptoCore,
      notificationTransport: this._notificationTransport
    })
    this._configTask = loadConfig()
      .then(
        config => {
          this._setConfig(config)
        },
        error => {
          this.updateConfig({})
          console.log({ loadConfigError: error })
        }
      )
    loadConfig(LEGACY_CONFIG_ITEM_KEY)
      .then(
        () => this.legacyConfig.add('1'),
        () => {}
      )
  }

  get api (): IAPI {
    return this._api
  }

  @modelAction _setConfig (config: any): void {
    assertConfig(config)
    this.config = new Config(config)
    this.configLoaded = true
  }

  updateConfig (config: IConfig): void {
    this._setConfig(config)
    this._configTask = this._configTask
      .then(async (): Promise<void> => await saveConfig(config))
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
    switch (this.transportState) {
      case EClientStatus.DESTROYED:
      case EClientStatus.NOADDRESS:
      case EClientStatus.STARTUP:
      case EClientStatus.ERROR:
        return false
    }
    return this.configLoaded && this.user.loaded
  }

  deleteEverything (): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    systemRimraf().finally(() => {
      this.updateConfig({})
    })
  }

  @modelAction _updateTransportState (): void {
    this.transportState = this._notificationTransport.state
    if (this.transportState === EClientStatus.ERROR) {
      const strategy = this._notificationTransport._strategy
      if (strategy instanceof ErrorStrategy) {
        console.log(strategy.error.stack)
      }
    }
  }

  onAttachedToRootStore (): () => void {
    return combinedDispose(
      autoRegisterRootStore(vaultStore),
      subscribeEvent(this._notificationTransport, 'state', () => this._updateTransportState(), true),
      autorun(
        () => {
          if (!this.configLoaded) return
          let address = this.config?.address ?? DEFAULT_ADDRESS
          if (/^\/\//.test(address)) {
            address = `https:${address}`
          }
          console.log(`Setting address: ${address}`)
          this._notificationTransport.address = address
        }
      ),
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
              if (message.code === EErrorCode.transportError) {
                console.error(message.error)
              }
              console.log({
                state: this.transportState,
                address: this._notificationTransport.address,
                errorNotification: message
              })
            }
          }
          const api = this._api
          api.notifications.processors.add(processor)
          const receivers = Object.values(subscriptions).map(subscription => new api.crypto.Receiver(subscription.receiver))
          console.log(`Resetting:\n  ${receivers.map(receiver => bufferToString(receiver.id, 'base64')).join('\n  ')}`)
          api.notifications
            .reset(receivers)
            .then(
              () => {},
              notificationResetError => {
                console.log('Error resetting the notifications')
                console.log({ notificationResetError })
              }
            )
          return combinedDispose(
            () => {
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
        },
        { fireImmediately: true }
      )
    )
  }
}
