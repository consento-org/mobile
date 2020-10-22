import { computed, autorun, observable } from 'mobx'
import { Model, model, tProp, types, prop, arraySet, ArraySet, modelAction } from 'mobx-keystone'
import { createContext, useContext } from 'react'
import { AsyncStorage } from 'react-native'
import { setup, IAPI, INotifications, IConsentoCrypto, INotification, EErrorCode, IReceiver } from '@consento/api'
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
import { subscribeEvent } from '../util/subscribeEvent'
import { autoRegisterRootStore } from '../util/autoRegisterRootStore'
import { map } from '../util/map'
import { exists } from '../styles/util/lang'
import { useAutorun } from '../util/useAutorun'

export const ConsentoContext = createContext<Consento | null>(null)

export const DEFAULT_ADDRESS = '//notify-2.consento.org'
export const DEFAULT_EXPIRES = 600
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

@model('consento/Config')
export class Config extends Model({
  address: tProp(types.nonEmptyString, () => DEFAULT_ADDRESS),
  expire: tProp(types.number, () => DEFAULT_EXPIRES)
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

interface IOperationSubscription {
  receiver: IReceiver
  subscription: ISubscription
}
type IOperationSubscriptions = Record<string, IOperationSubscription>

function fromUserSubscriptions (api: IAPI, subscriptions: ISubscriptionMap): IOperationSubscriptions {
  // TODO: This is a bad idea, this needs to be optimizied, the amount of operations done here grows exponentially
  const result: IOperationSubscriptions = {}
  for (const subscription of Object.values(subscriptions)) {
    const receiver = new api.crypto.Receiver(subscription.receiver)
    result[receiver.idBase64] = { receiver, subscription }
  }
  return result
}

function diffSubscriptions (stored: IOperationSubscriptions, current: IOperationSubscriptions): { newSubscriptions: IOperationSubscription[], goneSubscriptions: IOperationSubscription[] } {
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
  const goneSubscriptions = map(goneReceiveKeys.values(), receiveKey => {
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
  config: prop<Config | null>(null),
  configLoaded: prop(false)
}) implements IConsentoModel {
  _api: IAPI<ExpoTransport> | undefined
  _loadConfigError = observable.box<Error | undefined>()
  _configTask: Promise<void> | undefined
  _transportState = observable.box<EClientStatus>(EClientStatus.STARTUP)

  onInit (): void {
    this.deleteEverything = this.deleteEverything.bind(this)
    this.updateConfig = this.updateConfig.bind(this)

    this._configTask = loadConfig()
      .then(
        config => {
          this._setConfig(config)
        },
        error => {
          this.updateConfig({})
          this._loadConfigError.set(error)
        }
      )
    loadConfig(LEGACY_CONFIG_ITEM_KEY)
      .then(
        () => this.legacyConfig.add('1'),
        () => {}
      )
  }

  get api (): IAPI {
    return this._api as IAPI // set in onInit
  }

  @modelAction _setConfig (config: any): void {
    assertConfig(config)
    this.config = new Config(config)
    this.configLoaded = true
  }

  updateConfig (config: IConfig): void {
    this._setConfig(config)
    this._configTask = (this._configTask as Promise<void>) // set in onInit
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
    return this.configLoaded && this.user.loaded
  }

  @computed get transportReady (): boolean {
    switch (this._transportState.get()) {
      case EClientStatus.DESTROYED:
      case EClientStatus.NOADDRESS:
      case EClientStatus.STARTUP:
      case EClientStatus.ERROR:
        return false
    }
    return true
  }

  get transportError (): Error | undefined {
    const api = this._api
    if (api === undefined) {
      return new Error('No api')
    }
    return api.notifications.transport.error
  }

  get loadConfigError (): Error | undefined {
    return this._loadConfigError.get() ?? this.user.loadError
  }

  async deleteEverything (): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    try {
      await systemRimraf()
    } finally {
      this.users.add(createDefaultUser())
      this.users.delete(this.user)
      this.updateConfig({})
    }
  }

  @modelAction _updateTransportState (): void {
    this._transportState.set(this._api?.notifications.transport.state ?? EClientStatus.ERROR)
  }

  get transportState (): EClientStatus {
    return this._transportState.get()
  }

  onAttachedToRootStore (): () => void {
    this._api = setup({
      cryptoCore,
      notificationTransport: control => new ExpoTransport({ control, pingsUntilTimeout: 20 })
    })
    const { transport } = this._api.notifications
    return combinedDispose(
      autorun(() => {
        console.log(`TransportState: ${this.transportState} ${this.transportError?.toString() ?? ''}`)
      }),
      () => {
        transport
          .destroy()
          .catch(error => {
            console.log('cant be destroyed')
            console.error({ error })
          })
        this._api = undefined
      },
      autoRegisterRootStore(vaultStore),
      subscribeEvent(transport, 'change', () => this._updateTransportState(), true),
      autorun(
        () => {
          if (!this.configLoaded) return
          let address = this.config?.address ?? DEFAULT_ADDRESS
          if (/^\/\//.test(address)) {
            address = `https:${address}`
          }
          console.log(`Setting address: ${address}`)
          transport.address = address
        }
      ),
      safeReaction(
        () => ({ ready: this.ready, user: this.user }),
        ({ ready, user }) => {
          if (!ready) return
          const api = this._api as IAPI // set in onInit
          const subscriptions: IOperationSubscriptions = fromUserSubscriptions(api, user.subscriptions)
          const processor = async (message: INotification, encryptedMessage?: any): Promise<boolean> => {
            if (message.type === 'success') {
              const subscription = subscriptions[message.channelIdBase64]
              if (subscription === undefined) {
                console.log(`Received notification for ${message.channelIdBase64} but there was no subscriber ${String(encryptedMessage)}?!`)
                return false
              }
              console.log(`Received notification: ${message.channelIdBase64}`)
              subscription.subscription.action(message, this.api)
            } else {
              if (message.code === EErrorCode.transportError) {
                console.error(message.error)
              }
            }
            return true
          }
          api.notifications.processors.add(processor)
          const receivers = Object.values(subscriptions).map(subscription => new api.crypto.Receiver(subscription.receiver))
          api.notifications
            .reset(receivers)
            .then(
              success =>
                console.log(`Resetting the notifications:${receivers.map((receiver, index) => `\n  ${receiver.idBase64} [${(success[index] ?? false).toString()}]`).join('')}`)
              ,
              notificationResetError => {
                console.log(`Error resetting the notifications:${receivers.map(receiver => `\n  ${receiver.idBase64}`).join('')}`)
                console.log({ notificationResetError })
              }
            )
          return combinedDispose(
            () => {
              api.notifications.processors.delete(processor)
            },
            autorun(() => {
              console.log('Updating subscriptions')
              const { newSubscriptions, goneSubscriptions } = diffSubscriptions(subscriptions, fromUserSubscriptions(api, user.subscriptions))
              if (newSubscriptions.length > 0) {
                const receivers = newSubscriptions.map(({ receiver }) => receiver)
                this.api.notifications
                  .subscribe(receivers)
                  .then(
                    success =>
                      console.log(`Subscribed:${receivers.map((receiver, index) => `\n  ${receiver.idBase64} [${(success[index] ?? false).toString()}]`).join()}`)
                    ,
                    subscribeError => {
                      for (const receiver of receivers) {
                        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                        delete subscriptions[receiver.idBase64]
                      }
                      console.log(`Couldn't subscribe:${receivers.map(receiver => `\n  ${receiver.idBase64}`).join()}`)
                      console.log({ subscribeError })
                    }
                  )
              }
              if (goneSubscriptions.length > 0) {
                const receivers = goneSubscriptions.map(({ receiver }) => receiver)
                this.api.notifications
                  .unsubscribe(receivers)
                  .then(
                    success =>
                      console.log(`Unsubscribed:${receivers.map((receiver, index) => `\n  ${receiver.idBase64} [${(success[index] ?? false).toString()}]`).join()}`)
                    ,
                    unsubscribeError => {
                      for (const op of goneSubscriptions) {
                        subscriptions[op.receiver.idBase64] = op
                      }
                      console.log(`Couldn't unsubscribe:${receivers.map(receiver => `\n  ${receiver.idBase64}`).join()}`)
                      console.log({ unsubscribeError })
                    }
                  )
              }
            })
          )
        },
        { fireImmediately: true }
      )
    )
  }
}

export function useConsento (): Consento {
  const consento = useContext(ConsentoContext)
  if (!exists(consento)) {
    throw new Error('Not in a consento context.')
  }
  return consento
}

export function useUser (): User {
  const consento = useConsento()
  return useAutorun(() => consento.user, (a, b) => a.$modelId === b.$modelId)
}
