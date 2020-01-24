import { model, Model, prop, ExtendedModel, tProp, types, ArraySet, arraySet, modelAction, findParent, BaseModel } from 'mobx-keystone'
import { RequestBase } from './RequestBase'
import { Receiver, Sender, Connection } from './Connection'
import { ISuccessNotification, IAPI } from '@consento/api'
import { ISubscription, IConfirmLockeeMessage, IRequestLockeeMessage, MessageType, Message, requireAPI, hasAPI, ISubscriptionMap, IFinalizeLockeeMessage, IRequestUnlockMessage, IRevokeLockeeMessage } from './Consento.types'
import { VaultLockee, VaultData, File, IVaultLockeeConfirmation } from './VaultData'
import { bufferToString, Buffer } from '@consento/crypto/util/buffer'
import { expoVaultSecrets } from '../util/expoVaultSecrets'
import { computed, when } from 'mobx'
import { Relation } from './Relation'
import { vaultStore } from './VaultStore'
import sss from '@consento/shamirs-secret-sharing'
import { mapSubscriptions } from './mapSubscriptions'
import { find } from '../util/find'
import { last } from '../util/last'
import { now } from './now'
import { map } from '../util/map'
import randomBytes from '@consento/sync-randombytes'
import { humanModelId } from '../util/humanModelId'
import { generateId } from '../util/generateId'

export enum TVaultState {
  open = 'open',
  locked = 'locked',
  pending = 'pending',
  loading = 'loading'
}

@model('consento/MessageLogEntry')
export class MessageLogEntry extends Model({
  message: prop<string>(),
  time: prop<number>(() => now())
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
  static KEEP_ALIVE = 1 * 60 * 1000 // five minutes should be good?
  // static KEEP_ALIVE = 5 * 60 * 1000 // five minutes should be good?
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
export class Lock extends ExtendedModel(Connection, {
  shareHex: tProp(types.string),
  lockId: tProp(types.string),
  lockeeId: tProp(types.string)
}) {
  @computed get vaultLockee (): VaultLockee {
    return findVaultLockee(this, this.lockeeId)
  }
}

@model('consento/Vault/PendingLock')
export class PendingLock extends Model({
  receiver: tProp(types.model<Receiver>(Receiver)),
  lockeeId: tProp(types.string),
  lockId: tProp(types.string)
}) {
  @computed get vaultLockee (): VaultLockee {
    return findVaultLockee(this, this.lockeeId)
  }
}

function requestLockeeMessage (lockId: string, vault: Vault, firstMessage: Uint8Array, share: Buffer, vaultName: string): IRequestLockeeMessage {
  return {
    version: 1,
    type: MessageType.lockeeRequest,
    lockId,
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

function requestUnlockMessage (time: number, keepAlive: number): IRequestUnlockMessage {
  return {
    version: 1,
    type: MessageType.requestUnlock,
    time,
    keepAlive
  }
}

function revokeLockeeMessage (lockId: string): IRevokeLockeeMessage {
  return {
    version: 1,
    type: MessageType.revokeLockee,
    lockId
  }
}

@model('consento/Vault')
export class Vault extends Model({
  name: tProp(types.string, () => ''),
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
    return this.humanId
  }

  @computed get lockSubscriptions (): ISubscriptionMap {
    return mapSubscriptions(
      this.locks,
      lock => lock.receiver,
      (lock, notification) => {
        const message = notification.body as Message
        if (message.type === MessageType.unlock) {
          const secret = sss.combine([Buffer.from(lock.shareHex, 'hex'), Buffer.from(message.shareHex, 'hex')])
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
            if (pendingLock.lockeeId === message.lockId) {
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

  @computed get humanId (): string {
    return humanModelId(this.$modelId)
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
      Buffer.from(this.secretKeyBase64, 'base64'),
      {
        shares: 2,
        threshold: 2,
        random: (size: number): Buffer => randomBytes(Buffer.alloc(size))
      }
    )
    const lockId: string = generateId()
    const lockee = new VaultLockee({
      relationId: relation.$modelId,
      lockId,
      shareHex: bufferToString(myShare, 'hex'),
      initJSON: handshake.toJSON()
    })
    const pendingLock = new PendingLock({
      lockeeId: lockee.$modelId,
      lockId,
      receiver: new Receiver(handshake.receiver.toJSON())
    })
    this._addPendingLockee(lockee, pendingLock)
    try {
      await notifications.send(new crypto.Sender(senderJSON), requestLockeeMessage(lockId, this, handshake.firstMessage, theirShare, this.displayName))
    } catch (error) {
      this._removePendingLockee(lockee, pendingLock)
      throw error
    }
  }

  @modelAction _removePendingLockee (lockee: VaultLockee, pendingLock: PendingLock): void {
    this.data.lockees.delete(lockee)
    this.pendingLocks.delete(pendingLock)
  }

  @modelAction _addPendingLockee (lockee: VaultLockee, pendingLock: PendingLock): void {
    this.data.lockees.add(lockee)
    this.pendingLocks.add(pendingLock)
  }

  async confirmLockee (pendingLock: PendingLock, confirm: IConfirmLockeeMessage, api: IAPI): Promise<void> {
    const { vaultLockee } = pendingLock
    if (!vaultLockee.initPending) {
      console.log(`Warning: Repeat confirmation for vaultLockee ${vaultLockee.$modelId}`)
      return
    }
    const { crypto, notifications } = api
    let confirmation: IVaultLockeeConfirmation
    try {
      // TODO: Here the logic flow is messed up.
      //       there is some possible inconsistency where the vaultLockee is confirmed
      //       yet the final message is not sent.
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
        sender: new Sender(connectionJSON.sender),
        receiver: new Receiver(connectionJSON.receiver),
        lockeeId: vaultLockee.$modelId,
        lockId: pendingLock.lockId,
        shareHex
      }))
      this._updateLocks()
    } catch (err) {
      this.data.revokeLockee(vaultLockee)
      console.log({ err })
      console.log(`Warning: Couldn't confirm unlockee ${vaultLockee.$modelId} properly.`)
    }
  }

  async revokeLockee (lockee: VaultLockee, relation?: Relation): Promise<void> {
    if (!this.data.revokeLockee(lockee)) {
      return
    }
    this.pendingLocks.delete(find(this.pendingLocks, (pendingLock): pendingLock is PendingLock => pendingLock.lockId === lockee.lockId))
    this.locks.delete(find(this.locks, (lock): lock is Lock => lock.lockId === lockee.lockId))
    const { notifications, crypto } = requireAPI(this)
    const sender = lockee.sender ?? relation?.connection.sender ?? null
    if (sender === null) {
      return
    }
    await notifications.send(
      new crypto.Sender(sender),
      revokeLockeeMessage(lockee.lockId)
    )
  }

  _updateLocks (): void {
    (async (): Promise<void> => {
      return expoVaultSecrets.toggleDevicePersistence(this.dataKeyHex, this.locks.size > 0)
    })().catch(error => console.log({ error }))
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

  @computed get accessState (): VaultAccessEntry {
    if (this.isOpen) {
      return
    }
    return last(this.accessLog)
  }

  @modelAction requestUnlock (): void {
    if (!this.isClosable) {
      throw new Error('not-closable')
    }
    if (this.isOpen) {
      return
    }
    if (this.isPending) {
      return
    }
    const request = new VaultOpenRequest({ keepAlive: VaultOpenRequest.KEEP_ALIVE })
    this.accessLog.push(request)
    const api = requireAPI(this)
    Promise.all(
      map(this.locks.values(), async (lock): Promise<void> => {
        const sender = new api.crypto.Sender(lock.sender)
        await api.notifications.send(sender, requestUnlockMessage(request.time, request.keepAlive))
      })
    ).catch(lockSendError => console.log({ lockSendError }))
  }

  async lock (): Promise<boolean> {
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
    return expoVaultSecrets.delete(this.dataKeyHex)
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

  @computed get expiresIn (): number {
    if (!this.isPending) {
      return -1
    }
    const request = last(this.accessLog) as VaultOpenRequest
    return request.expiresIn
  }

  @computed get keepAlive (): number {
    if (!this.isPending) {
      return -1
    }
    const request = last(this.accessLog) as VaultOpenRequest
    return request.keepAlive
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
    const entry = last(this.accessLog)
    if (entry instanceof VaultOpenRequest) {
      if (entry.isActive) {
        return TVaultState.pending
      }
    }
    if (this.locks.size > 0) {
      return TVaultState.locked
    }
    return TVaultState.loading
  }
}
