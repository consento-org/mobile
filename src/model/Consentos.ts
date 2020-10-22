import { Relation } from './Relation'
import { RequestBase, TRequestState } from './RequestBase'
import { tProp, types, model, ExtendedModel, Model, modelAction, prop } from 'mobx-keystone'
import { computed, toJS } from 'mobx'
import { requireAPI, IConfirmLockeeMessage, MessageType, hasAPI, IUnlockMessage, IDenyLockeeMessage } from './Consento.types'
import { IHandshakeAcceptMessage, IHandshakeAcceptJSON, IHandshakeAccept, IAPI, IConnection } from '@consento/api'
import { Alert } from 'react-native'
import { Receiver, Sender } from './Connection'
import { Buffer, exists } from '@consento/api/util'
import { humanModelId } from '../util/humanModelId'

function confirmLockeeMessage (lockId: string, acceptMessage: IHandshakeAcceptMessage): IConfirmLockeeMessage {
  return {
    version: 1,
    type: MessageType.confirmLockee,
    lockId,
    acceptMessage
  }
}

function unlockMessage (shareHex: string): IUnlockMessage {
  return {
    version: 1,
    type: MessageType.unlock,
    shareHex
  }
}

function denyLockeeMessage (lockId: string): IDenyLockeeMessage {
  return {
    version: 1,
    type: MessageType.denyLockee,
    lockId
  }
}

@model('consento/consentos/BecomeLockee')
export class ConsentoBecomeLockee extends Model({
  relation: tProp(types.ref<Relation>()),
  receiver: tProp(types.maybeNull(types.model<Receiver>(Receiver)), () => null),
  sender: tProp(types.maybeNull(types.model<Sender>(Sender)), () => null),
  acceptHandshakeJSON: prop<IHandshakeAcceptJSON | undefined>(),
  lockId: tProp(types.maybeNull(types.string)),
  shareHex: tProp(types.maybeNull(types.string), () => null),
  creationTime: tProp(types.number, () => Date.now()),
  acceptTime: tProp(types.maybeNull(types.number), () => null),
  confirmTime: tProp(types.maybeNull(types.number), () => null),
  denyTime: tProp(types.maybeNull(types.number), () => null),
  cancelTime: tProp(types.maybeNull(types.number), () => null),
  vaultName: tProp(types.string),
  hiddenTime: tProp(types.maybeNull(types.number), () => null)
}) {
  @computed get relationName (): string | null {
    return this.relation.maybeCurrent?.name ?? null
  }

  @computed get relationAvatarId (): string | null {
    return this.relation.maybeCurrent?.avatarId ?? null
  }

  @computed get relationHumanId (): string {
    return humanModelId(this.relation.id)
  }

  @computed get acceptHandshake (): IHandshakeAccept | undefined {
    if (!exists(this.acceptHandshakeJSON)) {
      return
    }
    if (hasAPI(this)) {
      const { crypto } = requireAPI(this)
      return new crypto.HandshakeAccept(this.acceptHandshakeJSON)
    }
  }

  @computed get state (): TRequestState {
    if (this.cancelTime !== null) {
      return TRequestState.cancelled
    }
    if (this.denyTime !== null) {
      return TRequestState.denied
    }
    if (this.confirmTime !== null) {
      return TRequestState.confirmed
    }
    if (this.acceptTime !== null) {
      return TRequestState.accepted
    }
    return TRequestState.active
  }

  get isAccepted (): boolean {
    return this.isReceivingConfirmation || (this.sender !== null || this.receiver !== null)
  }

  get isHidden (): boolean {
    return this.hiddenTime !== null
  }

  get isReceivingConfirmation (): boolean {
    return this.state === TRequestState.accepted
  }

  get isCancelled (): boolean {
    return this.state === TRequestState.cancelled
  }

  @modelAction cancel (): void {
    this.cancelTime = Date.now()
    this.receiver = null
    this.sender = null
    this.acceptHandshakeJSON = undefined
  }

  @computed get handleAccept (): undefined | (() => any) {
    const accept = this.acceptHandshake
    const lockId = this.lockId
    if (this.state === TRequestState.active && exists(accept) && exists(lockId)) {
      const api = requireAPI(this)
      return () => {
        ;(async () => {
          this._setAccept(true)
          console.log(`Sent confirm Lockee message: ${(await api.notifications.send(accept.sender, confirmLockeeMessage(lockId, accept.acceptMessage))).join(', ')}`)
        })().catch(acceptError => {
          this._setAccept(false)
          console.log({ acceptError })
          Alert.alert(
            'Error',
            'Couldnt accept message',
            [
              { text: 'OK' }
            ]
          )
        })
      }
    }
  }

  @computed get handleHide (): () => any {
    if (this.state === TRequestState.active) {
      const accept = this.acceptHandshake
      const { lockId } = this
      if (!exists(accept)) {
        throw new Error('No Accept token available')
      }
      if (!exists(lockId)) {
        throw new Error('Missing the lock id')
      }
      const api = requireAPI(this)
      return () => {
        ;(async () => {
          this._setDeny(true)
          await api.notifications.send(accept.sender, denyLockeeMessage(lockId))
        })().catch(acceptError => {
          this._setDeny(false)
          console.log({ acceptError })
          Alert.alert(
            'Error',
            'Couldn\'t deny message',
            [
              { text: 'OK' }
            ]
          )
        })
      }
    }
    return () => this.hide()
  }

  @modelAction _setAccept (ok: boolean): void {
    const accept = this.acceptHandshakeJSON
    if (!exists(accept)) {
      throw new Error('No Accept token available' + String(this.acceptHandshakeJSON))
    }
    this.acceptTime = ok ? Date.now() : null
    this.receiver = ok ? new Receiver(toJS(accept.receiver)) : null
  }

  @modelAction _setDeny (ok: boolean): void {
    this.denyTime = ok ? Date.now() : null
  }

  finalize (api: IAPI, finalMessageBase64: string): void {
    const accept = this.acceptHandshakeJSON
    if (!exists(accept)) {
      console.log(`Warning: Already finalised Lockee ${this.$modelId}`)
      return
    }
    const handshake = new api.crypto.HandshakeAccept(accept)
    ;(async () => {
      const final = await handshake.finalize(Buffer.from(finalMessageBase64, 'base64'))
      this._finalize(final)
    })().catch(finalError => console.error(finalError))
  }

  @modelAction _finalize (connection: IConnection): void {
    this.acceptHandshakeJSON = undefined
    this.confirmTime = Date.now()
    this.receiver = new Receiver(connection.receiver.toJSON())
    this.sender = new Sender(connection.sender.toJSON())
  }

  @modelAction hide (): void {
    if (!this.isHidden) {
      this.hiddenTime = Date.now()
    }
  }
}

@model('consento/consentos/UnlockVault')
export class ConsentoUnlockVault extends ExtendedModel(RequestBase, {
  becomeUnlockee: tProp(types.ref<ConsentoBecomeLockee>()),
  relation: tProp(types.ref<Relation>()),
  vaultName: tProp(types.string)
}) {
  get receiver (): null {
    return null
  }

  @computed get state (): TRequestState {
    if (!exists(this.becomeUnlockee.maybeCurrent)) {
      return TRequestState.cancelled
    }
    if (this.becomeUnlockee.current.isCancelled) {
      return TRequestState.cancelled
    }
    return this._state
  }

  @computed get relationName (): string | null {
    return this.relation.maybeCurrent?.name ?? null
  }

  @computed get relationAvatarId (): string | null {
    return this.relation.maybeCurrent?.avatarId ?? null
  }

  @computed get relationHumanId (): string {
    return humanModelId(this.relation.id)
  }

  @computed get handleAccept (): undefined | (() => any) {
    if (!this.isActive) {
      return
    }
    const { shareHex, sender } = this.becomeUnlockee.maybeCurrent ?? {}
    if (!exists(shareHex) || !exists(sender)) {
      return
    }
    const api = requireAPI(this)
    return () => {
      ;(async (): Promise<void> => {
        this.acceptAndConfirm()
        console.log(`Submitted unlock: ${(await api.notifications.send(
          new api.crypto.Sender(sender),
          unlockMessage(shareHex)
        )).join(', ')}`)
      })()
        .catch(err => console.error(err))
    }
  }

  get handleDelete (): () => any {
    if (this.isActive) {
      return () => this.deny()
    }
    return () => this._delete()
  }

  @modelAction _delete (): void {
    this.deleted = true
  }
}

export type IAnyConsento = ConsentoUnlockVault | ConsentoBecomeLockee
