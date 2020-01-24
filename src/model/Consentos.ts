import { Relation } from './Relation'
import { RequestBase, TRequestState } from './RequestBase'
import { tProp, types, model, ExtendedModel, Model, modelAction, prop, Ref } from 'mobx-keystone'
import { computed, toJS } from 'mobx'
import { requireAPI, IConfirmLockeeMessage, MessageType, hasAPI, IUnlockMessage, IDenyLockeeMessage } from './Consento.types'
import { IHandshakeAcceptMessage, IHandshakeAcceptJSON, IHandshakeAccept, IAPI, IConnection } from '@consento/api'
import { Alert } from 'react-native'
import { Receiver, Sender } from './Connection'
import { Buffer } from 'buffer'
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
  acceptHandshakeJSON: prop<IHandshakeAcceptJSON>(),
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
  @computed get relationName (): string {
    return this.relation.maybeCurrent?.name
  }

  @computed get relationAvatarId (): string {
    return this.relation.maybeCurrent?.avatarId
  }

  @computed get relationHumanId (): string {
    return humanModelId(this.relation.id)
  }

  @computed get acceptHandshake (): IHandshakeAccept {
    if (this.acceptHandshakeJSON === null) {
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
    this.acceptHandshakeJSON = null
  }

  @computed get handleAccept (): () => any {
    if (this.state === TRequestState.active) {
      const api = requireAPI(this)
      return () => {
        ;(async () => {
          const accept = this.acceptHandshake
          this._setAccept(true)
          await api.notifications.send(accept.sender, confirmLockeeMessage(this.lockId, accept.acceptMessage))
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
      const api = requireAPI(this)
      return () => {
        ;(async () => {
          const accept = this.acceptHandshake
          this._setDeny(true)
          await api.notifications.send(accept.sender, denyLockeeMessage(this.lockId))
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
    this.acceptTime = ok ? Date.now() : null
    this.receiver = ok ? new Receiver(toJS(this.acceptHandshakeJSON.receiver)) : null
  }

  @modelAction _setDeny (ok: boolean): void {
    this.denyTime = ok ? Date.now() : null
  }

  finalize (api: IAPI, finalMessageBase64: string): void {
    if (this.acceptHandshakeJSON === null) {
      console.log(`Warning: Already finalised Lockee ${this.$modelId}`)
      return
    }
    const handshake = new api.crypto.HandshakeAccept(this.acceptHandshakeJSON)
    ;(async () => {
      const final = await handshake.finalize(Buffer.from(finalMessageBase64, 'base64'))
      this._finalize(final)
    })().catch(finalError => console.error(finalError))
  }

  @modelAction _finalize (connection: IConnection): void {
    this.acceptHandshakeJSON = null
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
  becomeUnlockee: tProp(types.ref<ConsentoBecomeLockee>())
}) {
  get receiver (): Receiver {
    return null
  }

  @computed get relationName (): string {
    return this.becomeUnlockee.current.relationName
  }

  @computed get relationHumanId (): string {
    return this.becomeUnlockee.current.relationHumanId
  }

  @computed get relationAvatarId (): string {
    return this.becomeUnlockee.current.relationAvatarId
  }

  get vaultName (): string {
    return this.becomeUnlockee.current.vaultName
  }

  get relation (): Ref<Relation> {
    return this.becomeUnlockee.current.relation
  }

  @computed get handleAccept (): () => any {
    if (this.isActive) {
      const api = requireAPI(this)
      return () => {
        const { shareHex, sender } = this.becomeUnlockee.current
        ;(async (): Promise<void> => {
          this.acceptAndConfirm()
          await api.notifications.send(
            new api.crypto.Sender(sender),
            unlockMessage(shareHex)
          )
        })()
          .catch(err => console.error(err))
      }
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
