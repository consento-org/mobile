import { computed, observable } from 'mobx'
import { Model, model, tProp, types, prop, arraySet, ArraySet, modelAction } from 'mobx-keystone'
import { createContext } from 'react'
import { AsyncStorage, AppStateStatus, AppState } from 'react-native'
import { setup, IAPI, INotifications, IConsentoCrypto } from '@consento/api'
import { ExpoTransport } from '@consento/notification-server'
import isURL from 'is-url-superb'
import { User, createDefaultUser } from './User'
import { getExpoToken } from '../util/getExpoToken'
import { cryptoCore } from '../cryptoCore'
import { safeAutorun } from '../util/safeAutorun'
import { Relation } from './Relation'
import { VaultLockee } from './VaultData'
import { rimraf } from '../util/expoRimraf'
import { first } from '../util/first'

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

async function createLockee ({ crypto, notifications }: IAPI, relation: Relation): Promise<VaultLockee> {
  const handshake = await crypto.initHandshake()

  return new VaultLockee({
    relationId: relation.$modelId,
    initJSON: handshake.toJSON(),
    confirmJSON: null
  })
}

@model('consento')
export class Consento extends Model({
  users: prop<ArraySet<User>>(() => arraySet()),
  config: prop<Config>(() => null)
}) {
  _apiReady = observable.box(Date.now())
  _api: IAPI

  onInit (): void {
    this.deleteEverything = this.deleteEverything.bind(this)
    this.updateConfig = this.updateConfig.bind(this)
    this.createLockee = this.createLockee.bind(this)
    loadConfig()
      .then(config => this._setConfig(config))
      .catch(error => {
        this.updateConfig({})
        console.log({ loadConfigError: error })
      })
  }

  async createLockee (relation: Relation): Promise<VaultLockee> {
    this.assertReady()
    return createLockee(this.api, relation)
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
    return this.api !== undefined && (first(this.users)?.loaded ?? false)
  }

  @modelAction _setApi (api: IAPI): void {
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
    rimraf('')
      .finally(() =>
        this._setApi(api)
      )
  }

  onAttachedToRootStore (): () => void {
    return safeAutorun(() => {
      if (this.config === null) {
        return
      }
      const { notificationTransport, destructTransport } = createTransport(this.config.address)
      const api = setup({
        cryptoCore,
        notificationTransport
      })
      api.notifications.reset([]).catch(error => {
        console.log(`Error resetting the notifications ${error}`)
      })
      this._setApi(api)
      return () => {
        this._setApi(undefined)
        destructTransport()
      }
    })
  }
}
