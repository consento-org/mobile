import { computed, action } from 'mobx'
import { model, Model, prop, tProp, types, ExtendedModel, Ref, rootRef, customRef, findParent } from 'mobx-keystone'
import { Connection } from './Connection'
import { RequestBase } from './RequestBase'
import { User } from './User'

export enum TVaultState {
  open = 'open',
  locked = 'locked',
  pending = 'pending'
}

const DEFAULT_VAULT_OPEN_TIME = 5000

@model('consento/MessageLogEntry')
export class MessageLogEntry extends Model({
  message: prop<string>(),
  time: prop<number>(() => Date.now())
}) {}

export type VaultLogEntry = MessageLogEntry


@model('consento/VaultClose')
export class VaultClose extends Model({
  time: prop<number>(() => Date.now())
}) {}

@model('consento/VaultOpen')
export class VaultOpen extends Model({
  time: prop<number>(() => Date.now())
}) {}

export const VaultOpenRequest = RequestBase('consento/VaultOpenRequest', DEFAULT_VAULT_OPEN_TIME)

export type VaultAccessEntry = typeof VaultOpenRequest | VaultClose | VaultOpen

@model('consento/VaultAccessOperation')
export class AccessOperation extends Model({
}) {}

export const MODEL = 'consento/Vault'

@model(MODEL)
export class Vault extends Model({
  name: tProp(types.maybeNull(types.string)),
  connections: prop<Connection[]>(),
  accessLog: prop<VaultAccessEntry[]>(() => [])
}) {
  // root: Folder
  log: VaultLogEntry[]
  _data: null

  @computed get isClosable () {
    return this.connections.length > 0
  }

  @action requestUnlock () {
    if (!this.isClosable) {
      throw new Error('not-closable')
    }
    this.accessLog.push(new VaultOpenRequest({}))
  }

  @action close () {
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

  unlock (secret: Uint8Array) {
    // this._data = new VaultData (secret)
    this.accessLog.push(new VaultOpen({}))
  }

  get data () {
    return this._data
  }

  @computed get isOpen () {
    return this.state === TVaultState.open
  }

  @computed get isPending () {
    return this.state === TVaultState.pending
  }

  @computed get state () {
    if (this._data !== null) {
      return TVaultState.open
    }
    const entry = this.accessLog[this.accessLog.length - 1]
    if (entry instanceof VaultOpenRequest && entry.isActive) {
      return TVaultState.pending
    }
    return TVaultState.locked
  }
}
