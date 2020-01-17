import { computed, observable, IObservableValue } from 'mobx'
import { model, modelAction, Model, prop, tProp, types, ExtendedModel, ObjectMap, registerRootStore } from 'mobx-keystone'
import { Lock } from './Connection'
import { RequestBase } from './RequestBase'
import { Buffer } from 'buffer'
import randomBytes from '@consento/sync-randombytes'
import { VaultData, File } from './VaultData'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
import { sodium } from '@consento/crypto/core/sodium'
import { bufferToString } from '@consento/crypto/util/buffer'

export enum TVaultState {
  open = 'open',
  locked = 'locked',
  pending = 'pending',
  loading = 'loading'
}

@model('consento/MessageLogEntry')
export class MessageLogEntry extends Model({
  message: prop<string>(),
  time: prop<number>(() => Date.now())
}) {}

export type VaultLogEntry = MessageLogEntry

@model('consento/Vault/Close')
export class VaultClose extends Model({
  time: prop<number>(() => Date.now())
}) {}

@model('consento/Vault/Open')
export class VaultOpen extends Model({
  time: prop<number>(() => Date.now())
}) {}

@model('consento/Vault/OpenRequest')
export class VaultOpenRequest extends ExtendedModel(RequestBase, {
}) {
  static KEEP_ALIVE = 5000
}

export type VaultAccessEntry = typeof VaultOpenRequest | VaultClose | VaultOpen

@model('consento/Vault/AccessOperation')
export class AccessOperation extends Model({
}) {}

const vaultSecrets: { [dataKeyHex: string]: Promise<string>} = {}
const vaultRoot = new ObjectMap<VaultData>({})
registerRootStore(vaultRoot)

@model('consento/Vault')
export class Vault extends Model({
  name: tProp(types.maybeNull(types.string), () => randomBytes(Buffer.alloc(4)).toString('hex')),
  locks: prop<Lock[]>(() => []),
  accessLog: prop<VaultAccessEntry[]>(() => []),
  dataKeyHex: tProp(types.string, () => {
    const dataKeyHex = randomBytes(Buffer.alloc(32)).toString('hex')
    const initProcess = (async (): Promise<string> => {
      const secretKey = await sodium.createSecretKey()
      const secretKeyBase64 = bufferToString(secretKey, 'base64')
      await setItemAsync(`vault-${dataKeyHex}`, secretKeyBase64)
      return secretKeyBase64
    })().catch((err): undefined => {
      console.log({ err })
      return undefined
    })
    vaultSecrets[dataKeyHex] = initProcess
    return dataKeyHex
  })
}) {
  // root: Folder
  log: VaultLogEntry[]

  _initing: IObservableValue<() => any>
  _attachCounter: number

  onInit (): void {
    this._attachCounter = 0
    this._initing = observable.box<() => any>(null)
  }

  onAttachedToRootStore (): () => void {
    /**
     * WORKAROUND
     *
     * mobx-keystone will not execute detachment in order.
     * It will run .onAttachedToRootStore twice before running
     * the first "detach" function. By setting a counter,
     * we make sure that only one .attach is run at a time.
     */
    if (this._attachCounter === 0) {
      let attached = true
      ;(async () => {
        let vaultSecret = vaultSecrets[this.dataKeyHex]
        if (vaultSecret === undefined) {
          vaultSecret = getItemAsync(`vault-${this.dataKeyHex}`)
          vaultSecrets[this.dataKeyHex] = vaultSecret
        }
        const secretKeyBase64 = await vaultSecret
        if (!attached) {
          return
        }
        if (secretKeyBase64 !== undefined) {
          this._unlock(secretKeyBase64)
        }
        this._initing.set(null)
      })().catch(err => {
        if (!attached) {
          this._initing.set(null)
        }
        console.log({ err })
      })
      this._initing.set(() => {
        attached = false
      })
    }
    this._attachCounter += 1
    return () => {
      this._attachCounter -= 1
      if (this._attachCounter === 0) {
        const deInit = this._initing.get()
        if (deInit !== null) {
          deInit()
          this._initing.set(null)
        }
        vaultRoot.delete(this.dataKeyHex)
      }
    }
  }

  findFile (modelId: string): File {
    return this.data?.findFile(modelId)
  }

  newFilename (): string {
    return this.data?.newFilename()
  }

  @computed get data (): VaultData {
    return vaultRoot.get(this.dataKeyHex)
  }

  @computed get isClosable (): boolean {
    return this.locks.length > 0
  }

  @modelAction setName (name: string): void {
    this.name = name
  }

  @modelAction requestUnlock (): void {
    if (!this.isClosable) {
      throw new Error('not-closable')
    }
    this.accessLog.push(new VaultOpenRequest({}))
  }

  @modelAction close (): void {
    if (!this.isClosable) {
      throw new Error('not-closable')
    }
    if (this.isPending) {
      const entry = this.accessLog[this.accessLog.length - 1]
      if (entry instanceof VaultOpenRequest) {
        entry.cancel()
      }
    }
    if (!this.isOpen) {
      return // Nothing to see/nothing to do.
    }
    this.accessLog.push(new VaultClose({}))
  }

  @modelAction _unlock (secretKeyBase64: string): void {
    const newVault = new VaultData({ secretKeyBase64, dataKeyHex: this.dataKeyHex })
    vaultRoot.set(this.dataKeyHex, newVault)
  }

  @modelAction unlock (secretKeyBase64: string): void {
    this._unlock(secretKeyBase64)
    this.accessLog.push(new VaultOpen({}))
  }

  @computed get isOpen (): boolean {
    return this.state === TVaultState.open
  }

  @computed get isPending (): boolean {
    return this.state === TVaultState.pending
  }

  @computed get isLoading (): boolean {
    return this.state === TVaultState.loading
  }

  @computed get state (): TVaultState {
    if (this._initing.get() !== null) {
      return TVaultState.loading
    }
    if (this.data !== undefined) {
      if (!this.data.loaded) {
        return TVaultState.loading
      }
      return TVaultState.open
    }
    const entry = this.accessLog[this.accessLog.length - 1]
    if (entry instanceof VaultOpenRequest && entry.isActive) {
      return TVaultState.pending
    }
    return TVaultState.locked
  }
}
