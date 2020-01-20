import { computed } from 'mobx'
import { model, modelAction, Model, prop, tProp, types, ExtendedModel } from 'mobx-keystone'
import { Buffer } from 'buffer'
import { Lock } from './Connection'
import { RequestBase } from './RequestBase'
import { VaultData, File } from './VaultData'
import { expoVaultSecrets } from '../util/expoVaultSecrets'
import { vaultStore } from './VaultStore'

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

@model('consento/Vault')
export class Vault extends Model({
  name: tProp(types.maybeNull(types.string), () => null),
  locks: prop<Lock[]>(() => []),
  accessLog: prop<VaultAccessEntry[]>(() => []),
  dataKeyHex: tProp(types.string, () => expoVaultSecrets.createDataKeyHex())
}) {
  log: VaultLogEntry[]

  @computed get displayName (): string {
    if (this.name !== null && this.name !== '') {
      return this.name
    }
    return this.defaultName
  }

  @computed get defaultName (): string {
    const idBuffer = Buffer.from(this.$modelId, 'utf8')
    return `${idBuffer.readUInt16BE(0).toString(16)}-${idBuffer.readUInt16BE(1).toString(16)}-${idBuffer.readUInt16BE(2).toString(16)}-${idBuffer.readUInt16BE(3).toString(16)}`.toUpperCase()
  }

  findFile (modelId: string): File {
    return this.data?.findFile(modelId)
  }

  newFilename (): string {
    return this.data?.newFilename()
  }

  @computed get data (): VaultData {
    return vaultStore.vaults.get(this.dataKeyHex)
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

  async unlock (secretKeyBase64: string, persistOnDevice: boolean): Promise<void> {
    // This triggers vaultStore!
    await expoVaultSecrets.unlock(this.dataKeyHex, secretKeyBase64, persistOnDevice)
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
    if (vaultStore.loading) {
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
