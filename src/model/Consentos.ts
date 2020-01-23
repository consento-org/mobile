import { Relation } from './Relation'
import { RequestBase, TRequestState } from './RequestBase'
import { tProp, types, model, ExtendedModel, Model, modelAction, prop, Ref } from 'mobx-keystone'
import { computed, observable, toJS } from 'mobx'
import { requireAPI, IConfirmLockeeMessage, MessageType, hasAPI, IUnlockMessage } from './Consento.types'
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

@model('consento/consentos/BecomeLockee')
export class ConsentoBecomeLockee extends Model({
  relation: tProp(types.ref<Relation>()),
  receiver: tProp(types.maybeNull(types.model<Receiver>(Receiver)), () => null),
  sender: tProp(types.maybeNull(types.model<Sender>(Sender)), () => null),
  acceptHandshakeJSON: prop<IHandshakeAcceptJSON>(),
  lockId: tProp(types.maybeNull(types.string)),
  shareHex: tProp(types.maybeNull(types.string), () => null),
  creationTime: tProp(types.number, () => Date.now()),
  vaultName: tProp(types.string),
  deleted: tProp(types.boolean, () => false)
}) {
  _lock = observable.box<boolean>(false)

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

  @computed get isReceivingConfirmation (): boolean {
    if (this.acceptHandshakeJSON === null) {
      return false
    }
    if (this.receiver === null) {
      return false
    }
    return true
  }

  get state (): TRequestState {
    if (this.acceptHandshakeJSON !== null) {
      return TRequestState.active
    }
    if (this.shareHex !== null) {
      return TRequestState.accepted
    }
    return TRequestState.cancelled
  }

  @computed get handleAccept (): () => any {
    if (this.isLocked) {
      return
    }
    if (this.isReceivingConfirmation) {
      return
    }
    if (this.state === TRequestState.active) {
      const api = requireAPI(this)
      return () => {
        this._lock.set(true)
        ;(async () => {
          const accept = this.acceptHandshake
          this._setReceiveConfirmation(true)
          await api.notifications.send(accept.sender, confirmLockeeMessage(this.lockId, accept.acceptMessage))
        })().then(
          () => {
            this._lock.set(false)
          },
          acceptError => {
            this._setReceiveConfirmation(false)
            this._lock.set(false)
            console.log({ acceptError })
            Alert.alert(
              'Error',
              'Couldnt accept message',
              [
                { text: 'OK' }
              ]
            )
          }
        )
      }
    }
  }

  get isLocked (): boolean {
    return this._lock.get()
  }

  @modelAction _setReceiveConfirmation (ok: boolean): void {
    this.receiver = ok ? new Receiver(toJS(this.acceptHandshakeJSON.receiver)) : null
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
    this.receiver = new Receiver(connection.receiver.toJSON())
    this.sender = new Sender(connection.sender.toJSON())
    this._lock.set(false)
  }

  @computed get handleDelete (): () => any {
    if (this.state === TRequestState.accepted) {
      return () => {
        this.delete()
      }
    }
  }

  @modelAction delete (): void {
    if (this.deleted === false) {
      this.deleted = true
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
        ;(async (): Promise<string[]> => {
          return api.notifications.send(
            new api.crypto.Sender(sender),
            unlockMessage(shareHex)
          )
        })()
          .catch(err => console.error(err))
      }
    }
  }

  get handleDelete (): () => any {
    return null
  }
}

export type IAnyConsento = ConsentoUnlockVault | ConsentoBecomeLockee
