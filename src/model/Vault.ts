import { computed } from 'mobx'
import { model, modelAction, Model, prop, tProp, types, ExtendedModel } from 'mobx-keystone'
import { Connection } from './Connection'
import { RequestBase } from './RequestBase'
import { Buffer } from 'buffer'
import randomBytes from '@consento/sync-randombytes'
import { VaultData } from './VaultData'

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

export interface IImage {
  secretKey: string | Uint8Array
  width: number
  height: number
  exif: { [key: string]: any }
}

@model('consento/Vault')
export class Vault extends Model({
  name: tProp(types.maybeNull(types.string), () => randomBytes(Buffer.alloc(4)).toString('hex')),
  connections: prop<Connection[]>(() => []),
  accessLog: prop<VaultAccessEntry[]>(() => []),
  dataKeyHex: tProp(types.string, () => randomBytes(Buffer.alloc(32)).toString('hex')),
  dataSecretBase64: tProp(types.maybeNull(types.string), () => null),
  data: tProp(types.maybeNull(types.model(VaultData)), () => null)
}) {
  // root: Folder
  log: VaultLogEntry[]
  images: { [key: string]: IImage } = {}

  findImage (imageKey: string): IImage {
    return this.images[imageKey]
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

  unlock (secret: Uint8Array): void {
    // this._data = new VaultData (secret)
    this.accessLog.push(new VaultOpen({}))
  }

  @computed get isOpen (): boolean {
    return this.state === TVaultState.open
  }

  @computed get isPending (): boolean {
    return this.state === TVaultState.pending
  }

  @computed get state (): TVaultState {
    // if (this._data !== null) {
    //   return TVaultState.open
    // }
    // const entry = this.accessLog[this.accessLog.length - 1]
    // if (entry instanceof VaultOpenRequest && entry.isActive) {
    //   return TVaultState.pending
    // }
    // return TVaultState.locked
    return TVaultState.open
  }
}
