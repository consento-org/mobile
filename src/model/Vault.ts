import { computed } from 'mobx'
import { model, modelAction, Model, prop, tProp, types, ExtendedModel } from 'mobx-keystone'
import { Connection } from './Connection'
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
  pending = 'pending'
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

const vaultsAboutToInit: { [dataKeyHex: string]: Promise<string>} = {}

@model('consento/Vault')
export class Vault extends Model({
  name: tProp(types.maybeNull(types.string), () => randomBytes(Buffer.alloc(4)).toString('hex')),
  connections: prop<Connection[]>(() => []),
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
    vaultsAboutToInit[dataKeyHex] = initProcess
    return dataKeyHex
  }),
  data: prop<VaultData>(() => null)
}) {
  // root: Folder
  log: VaultLogEntry[]

  onInit (): void {
    (async () => {
      let secretKeyBase64 = await vaultsAboutToInit[this.dataKeyHex]
      if (secretKeyBase64 === undefined) {
        secretKeyBase64 = await getItemAsync(`vault-${this.dataKeyHex}`)
      }
      if (secretKeyBase64 !== undefined) {
        this._unlock(secretKeyBase64)
      }
    })().catch(err => {
      console.log({ err })
    })
  }

  findFile (modelId: string): File {
    return this.data?.findFile(modelId)
  }

  @computed get isClosable (): boolean {
    return this.connections.length > 0
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
    this.data = new VaultData({ secretKeyBase64, dataKeyHex: this.dataKeyHex })
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

  @computed get state (): TVaultState {
    if (this.data !== null) {
      return TVaultState.open
    }
    const entry = this.accessLog[this.accessLog.length - 1]
    if (entry instanceof VaultOpenRequest && entry.isActive) {
      return TVaultState.pending
    }
    return TVaultState.locked
  }
}
