import { model, Model, prop, ExtendedModel, tProp, types, ArraySet, arraySet, modelAction, findParent, BaseModel } from 'mobx-keystone'
import { RequestBase } from './RequestBase'
import { Receiver } from './Connection'
import { ISuccessNotification, IAPI } from '@consento/api'
import { ISubscription, IConfirmLockeeMessage, IRequestLockeeMessage, MessageType, Message, requireAPI, hasAPI, ISubscriptionMap, IFinalizeLockeeMessage } from './Consento.types'
import { VaultLockee, VaultData, File, IVaultLockeeConfirmation } from './VaultData'
import { bufferToString, Buffer } from '@consento/crypto/util/buffer'
import { expoVaultSecrets } from '../util/expoVaultSecrets'
import { computed, when } from 'mobx'
import { Relation } from './Relation'
import { vaultStore } from './VaultStore'
import sss from '@consento/shamirs-secret-sharing'
import { mapSubscriptions } from './mapSubscriptions'
import { find } from '../util/find'

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

function findParentVault (item: BaseModel<any, any>): Vault {
  return findParent(
    item,
    (parent: BaseModel<any, any>): parent is Vault => parent.$modelType === Vault.$modelType
  )
}

function findVaultLockee (item: BaseModel<any, any>, lockeeId: string): VaultLockee {
  const vault = findParentVault(item)
  return find(vault?.data.lockees, (lockee): lockee is VaultLockee => lockee.$modelId === lockeeId)
}

@model('consento/Vault/Lock')
export class Lock extends ExtendedModel(Receiver, {
  shareHex: tProp(types.string),
  lockeeId: tProp(types.string)
}) {
  @computed get vaultLockee (): VaultLockee {
    return findVaultLockee(this, this.lockeeId)
  }
}

@model('consento/Vault/PendingLock')
export class PendingLock extends Model({
  receiver: tProp(types.model<Receiver>(Receiver)),
  lockeeId: tProp(types.string)
}) {
  @computed get vaultLockee (): VaultLockee {
    return findVaultLockee(this, this.lockeeId)
  }
}

function requestLockeeMessage (pendingLock: PendingLock, vault: Vault, firstMessage: Uint8Array, share: Buffer, vaultName: string): IRequestLockeeMessage {
  return {
    version: 1,
    type: MessageType.lockeeRequest,
    pendingLockId: pendingLock.$modelId,
    firstMessageBase64: bufferToString(firstMessage, 'base64'),
    shareHex: bufferToString(share, 'hex'),
    vaultName
  }
}

function finalizeLockeeMessage (finalMessage: Uint8Array): IFinalizeLockeeMessage {
  return {
    version: 1,
    type: MessageType.finalizeLockee,
    finalMessageBase64: bufferToString(finalMessage, 'base64')
  }
}

@model('consento/Vault')
export class Vault extends Model({
  name: tProp(types.maybeNull(types.string), () => null),
  locks: prop<ArraySet<Lock>>(() => arraySet()),
  pendingLocks: prop<ArraySet<PendingLock>>(() => arraySet()),
  pendingNotifications: prop<ArraySet<ISuccessNotification>>(() => arraySet()),
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

  @computed get lockSubscriptions (): ISubscriptionMap {
    return mapSubscriptions(
      this.locks,
      lock => lock,
      (lock, notification) => {
        const message = notification.body as Message
        if (message.type === MessageType.unlock) {
          const secret = sss.combine([lock.shareHex, message.shareHex])
          this.unlock(bufferToString(secret, 'base64'), false)
            .catch(unlockError => unlockError)
        }
      }
    )
  }

  onInit (): void {
    when(
      () => this.isOpen && hasAPI(this),
      () => {
        const api = requireAPI(this)
        for (const notification of this.pendingNotifications) {
          this.pendingNotifications.delete(notification)
          const message = notification.body as Message
          if (message.type !== MessageType.confirmLockee) {
            continue
          }
          for (const pendingLock of this.pendingLocks) {
            if (pendingLock.lockeeId === message.pendingLockId) {
              this.processPendingNotification(pendingLock, notification, api)
              break
            }
          }
        }
      }
    )
  }

  processPendingNotification (pendingLock: PendingLock, notification: ISuccessNotification, api: IAPI): void {
    if (this.isOpen) {
      const message = notification.body as Message
      if (message.type === MessageType.confirmLockee) {
        this.confirmLockee(pendingLock, message, api)
          .catch(confirmLockeeError => console.error({ confirmLockeeError }))
      }
    } else {
      this.pendingNotifications.add(notification)
    }
  }

  @computed get pendingLockSubscriptions (): ISubscriptionMap {
    return mapSubscriptions(
      this.pendingLocks,
      pendingLock => pendingLock.receiver,
      (pendingLock, notification, api) => this.processPendingNotification(pendingLock, notification, api)
    )
  }

  @computed get subscriptions (): { [key: string]: ISubscription } {
    return {
      ...this.lockSubscriptions,
      ...this.pendingLockSubscriptions
    }
  }

  @computed get defaultName (): string {
    const idBuffer = Buffer.from(this.$modelId, 'utf8')
    return `${idBuffer.readUInt16BE(0).toString(16)}-${idBuffer.readUInt16BE(1).toString(16)}-${idBuffer.readUInt16BE(2).toString(16)}-${idBuffer.readUInt16BE(3).toString(16)}`.toUpperCase()
  }

  @computed get secretKeyBase64 (): string {
    return expoVaultSecrets.secretsBase64.get(this.dataKeyHex)
  }

  async addLockee (relation: Relation): Promise<void> {
    const { crypto, notifications } = requireAPI(this)
    const handshake = await crypto.initHandshake()
    const { connection: { sender: senderJSON } } = relation
    if (!this.isOpen) {
      throw new Error('Cant add lockee on closed vault!')
    }
    const [myShare, theirShare] = sss.split(
      this.secretKeyBase64,
      { shares: 2, threshold: 2 }
    )
    const lockee = new VaultLockee({
      relationId: relation.$modelId,
      shareHex: bufferToString(myShare, 'hex'),
      initJSON: handshake.toJSON()
    })
    const pendingLock = new PendingLock({
      lockeeId: lockee.$modelId,
      receiver: new Receiver(handshake.receiver.toJSON())
    })
    this._addLockee(lockee, pendingLock)
    try {
      await notifications.send(new crypto.Sender(senderJSON), requestLockeeMessage(pendingLock, this, handshake.firstMessage, theirShare, this.displayName))
    } catch (error) {
      this._removeLockee(lockee, pendingLock)
      throw error
    }
  }

  @modelAction _removeLockee (lockee: VaultLockee, pendingLock: PendingLock): void {
    this.data.lockees.delete(lockee)
    this.pendingLocks.delete(pendingLock)
  }

  @modelAction _addLockee (lockee: VaultLockee, pendingLock: PendingLock): void {
    this.data.lockees.add(lockee)
    this.pendingLocks.add(pendingLock)
  }

  async confirmLockee (pendingLock: PendingLock, confirm: IConfirmLockeeMessage, api: IAPI): Promise<void> {
    const { vaultLockee } = pendingLock
    if (!vaultLockee.initPending) {
      console.log(`Warning: Repeat confirmation for vaultLockee ${vaultLockee.$modelId}`)
      return
    }
    console.log('confirm lockee')
    const { crypto, notifications } = api
    let confirmation: IVaultLockeeConfirmation
    try {
      confirmation = await vaultLockee.confirm(confirm.acceptMessage, api)
      if (confirmation === undefined) {
        console.log(`Warning: Couldn't confirm ${vaultLockee.$modelId}`)
        return
      }
    } catch (confirmationError) {
      console.log({ confirmationError })
      return
    }
    this.pendingLocks.delete(pendingLock)
    try {
      const { connectionJSON, shareHex, finalMessage } = confirmation
      const sender = new crypto.Sender(connectionJSON.sender)
      await notifications.send(sender, finalizeLockeeMessage(finalMessage))
      this.locks.add(new Lock({
        ...connectionJSON.receiver,
        lockeeId: vaultLockee.$modelId,
        shareHex
      }))
    } catch (err) {
      this.pendingLocks.add(pendingLock)
      console.log({ err })
      console.log(`Warning: Couldn't confirm unlockee ${vaultLockee.$modelId} properly`)
    }
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
    return this.locks.size > 0
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
