import { model, Model, prop, ExtendedModel, tProp, types, ArraySet, arraySet, modelAction, findParent, BaseModel } from 'mobx-keystone'
import { RequestBase } from './RequestBase'
import { Receiver, Sender, Connection } from './Connection'
import { ISuccessNotification, IAPI } from '@consento/api'
import { ISubscription, IConfirmLockeeMessage, IRequestLockeeMessage, MessageType, Message, requireAPI, hasAPI, ISubscriptionMap, IFinalizeLockeeMessage, IRequestUnlockMessage, IRevokeLockeeMessage, ILogEntry } from './Consento.types'
import { VaultLockee, VaultData, File, IVaultLockeeConfirmation, TVaultRevokeReason } from './VaultData'
import { bufferToString, Buffer } from '@consento/api/util'
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
import randomBytes from 'get-random-values-polypony'
import { humanModelId } from '../util/humanModelId'
import { generateId } from '../util/generateId'

export enum TVaultState {
  open = 'open',
  locked = 'locked',
  pending = 'pending',
  loading = 'loading'
}

function mergeLog (...logs: ILogEntry[][]): ILogEntry[] {
  const indices = logs.map(() => 0)
  const done = logs.map(log => log.length === 0)
  let doneCount = done.reduce(
    (total, done) => total + (done ? 1 : 0),
    0
  )
  const result = []
  while (doneCount < logs.length) {
    let oldestLogNo: number
    let oldestIndex: number
    let oldest: ILogEntry
    for (let logNo = 0; logNo < indices.length; logNo++) {
      if (done[logNo]) {
        continue
      }
      const index = indices[logNo]
      const logEntry = logs[logNo][index]
      if (oldest === undefined) {
        oldestLogNo = logNo
        oldestIndex = index
        oldest = logEntry
      } else if (logEntry.time < oldest.time) {
        oldestLogNo = logNo
        oldest = logEntry
        oldestIndex = index
      }
    }
    if (oldestIndex === undefined) {
      throw new Error('We should always have one entry!')
    }
    const nextIndex = oldestIndex + 1
    indices[oldestLogNo] = nextIndex
    result.push(oldest)
    if (logs[oldestLogNo].length === nextIndex) {
      done[oldestLogNo] = true
      doneCount += 1
    }
  }
  return result
}

@model('consento/MessageLogEntry')
export class MessageLogEntry extends Model({
  text: prop<string>(),
  time: prop<number>(() => now()),
  meta: prop<{}>(() => null)
}) implements ILogEntry {
  get key (): string {
    return this.$modelId
  }
}

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
}) {}

export type VaultAccessEntry = typeof VaultOpenRequest | VaultClose | VaultOpen

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
  creationTime: tProp(types.number, () => Date.now()),
  name: tProp(types.string, () => ''),
  locks: prop<ArraySet<Lock>>(() => arraySet()),
  pendingLocks: prop<ArraySet<PendingLock>>(() => arraySet()),
  pendingNotifications: prop<ArraySet<ISuccessNotification>>(() => arraySet()),
  accessLog: prop<VaultAccessEntry[]>(() => []),
  operationLog: prop<ILogEntry[]>(() => []),
  dataKeyHex: tProp(types.string, () => expoVaultSecrets.createDataKeyHex())
}) {
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
          if (
            message.type === MessageType.confirmLockee ||
            message.type === MessageType.denyLockee
          ) {
            for (const pendingLock of this.pendingLocks) {
              if (pendingLock.lockeeId === message.lockId) {
                this.processPendingNotification(pendingLock, notification, api)
                break
              }
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
      if (message.type === MessageType.denyLockee) {
        try {
          this.denyLockee(pendingLock)
        } catch (denyLockeeError) {
          console.error({ denyLockeeError })
        }
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
      this._removePendingLockee(lockee, pendingLock, TVaultRevokeReason.error)
      throw error
    }
  }

  @modelAction _removePendingLockee (lockee: VaultLockee, pendingLock: PendingLock, reason: TVaultRevokeReason): void {
    if (this.data.revokeLockee(lockee, reason)) {
      this.pendingLocks.delete(pendingLock)
    }
  }

  @modelAction _addPendingLockee (lockee: VaultLockee, pendingLock: PendingLock): void {
    if (this.data.addLockee(lockee)) {
      this.pendingLocks.add(pendingLock)
    }
  }

  denyLockee (pendingLock: PendingLock): void {
    const { vaultLockee } = pendingLock
    if (!vaultLockee.initPending) {
      console.log(`Warning: Repeat denial for vaultLockee ${vaultLockee.$modelId}`)
      return
    }
    this._removePendingLockee(vaultLockee, pendingLock, TVaultRevokeReason.denied)
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
      this.data.revokeLockee(vaultLockee, TVaultRevokeReason.error)
      console.log({ err })
      console.log(`Warning: Couldn't confirm unlockee ${vaultLockee.$modelId} properly.`)
    }
  }

  async revokeLockee (lockee: VaultLockee, relation?: Relation): Promise<void> {
    if (!this.data.revokeLockee(lockee, TVaultRevokeReason.revoked)) {
      return
    }
    this.pendingLocks.delete(find(this.pendingLocks, (pendingLock): pendingLock is PendingLock => pendingLock.lockId === lockee.lockId))
    this.locks.delete(find(this.locks, (lock): lock is Lock => lock.lockId === lockee.lockId))
    this._updateLocks()
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
      const persistOnDevice = this.locks.size === 0
      return await expoVaultSecrets.toggleDevicePersistence(this.dataKeyHex, persistOnDevice)
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
    if (this.name !== name) {
      this.operationLog.push(new MessageLogEntry({
        text: `You changed the name from "${this.name}" to "${name}"`,
        meta: {
          type: 'name-change',
          old: this.name,
          new: name
        }
      }))
      this.name = name
    }
  }

  @computed get accessState (): VaultAccessEntry {
    if (this.isOpen) {
      return
    }
    return last(this.accessLog)
  }

  requestUnlock (keepAlive: number): void {
    if (!this.isClosable) {
      throw new Error('not-closable')
    }
    if (this.isOpen) {
      return
    }
    if (this.isPending) {
      return
    }
    const request = new VaultOpenRequest({ keepAlive })
    this._addAccessEntry(request)
    const api = requireAPI(this)
    Promise.all(
      map(this.locks.values(), async (lock): Promise<void> => {
        const sender = new api.crypto.Sender(lock.sender)
        await api.notifications.send(sender, requestUnlockMessage(request.time, request.keepAlive))
      })
    ).catch(lockSendError => console.log({ lockSendError }))
  }

  @computed get log (): ILogEntry [] {
    if (!this.isOpen) {
      return []
    }
    return mergeLog(
      this.operationLog,
      this.accessLogAsLog,
      this.data.log
    ).reverse()
  }

  @computed get accessLogAsLog (): ILogEntry[] {
    const logEntries: ILogEntry[] = [{
      key: this.$modelId,
      time: this.creationTime,
      text: 'This vault was created.'
    }]
    for (let i = 0; i < this.accessLog.length; i++) {
      const accessLogEntry = this.accessLog[i]
      if (accessLogEntry instanceof VaultOpenRequest) {
        logEntries.push({
          time: accessLogEntry.creationTime,
          key: accessLogEntry.$modelId,
          text: 'You asked to unlock this vault.'
        })
        const nextEntry = this.accessLog[i + 1]
        if (!(nextEntry instanceof VaultOpen)) {
          logEntries.push({
            time: accessLogEntry.expiration,
            key: `${accessLogEntry.$modelId}#expired`,
            text: 'Nobody helped you unlock in time.'
          })
        }
      }
      if (accessLogEntry instanceof VaultClose) {
        logEntries.push({
          time: accessLogEntry.time,
          key: accessLogEntry.$modelId,
          text: 'You locked this vault.'
        })
      }
      if (accessLogEntry instanceof VaultOpen) {
        logEntries.push({
          time: accessLogEntry.time,
          key: accessLogEntry.$modelId,
          text: 'You successfully unlocked this vault!'
        })
      }
    }
    return logEntries
  }

  async lock (): Promise<boolean> {
    if (!this.isClosable) {
      throw new Error('not-closable')
    }
    if (this.isPending) {
      const entry = last(this.accessLog)
      if (entry instanceof VaultOpenRequest) {
        entry.cancel()
      }
    }
    if (!this.isOpen) {
      return // Nothing to see/nothing to do.
    }
    this._addAccessEntry(new VaultClose({}))
    return await expoVaultSecrets.delete(this.dataKeyHex)
  }

  @modelAction _addAccessEntry (entry: VaultAccessEntry): void {
    this.accessLog.push(entry)
  }

  async unlock (secretKeyBase64: string, persistOnDevice: boolean): Promise<void> {
    await expoVaultSecrets.unlock(this.dataKeyHex, secretKeyBase64, persistOnDevice)
    if (this.isClosable) {
      this._addAccessEntry(new VaultOpen({}))
    }
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
