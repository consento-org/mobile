import { Relation } from './Relation'
import { Vault } from './Vault'
import { RequestBase, TRequestState } from './RequestBase'
import { tProp, types, model, ExtendedModel, Model, modelAction, prop } from 'mobx-keystone'
import { computed, observable, toJS } from 'mobx'
import { requireAPI, IConfirmLockeeMessage, MessageType, hasAPI } from './Consento.types'
import { IHandshakeAcceptMessage, IHandshakeAcceptJSON, IHandshakeAccept, IAPI, IConnection } from '@consento/api'
import { Alert } from 'react-native'
import { Receiver, Sender } from './Connection'
import { Buffer } from 'buffer'

function confirmLockeeMessage (pendingLockId: string, acceptMessage: IHandshakeAcceptMessage): IConfirmLockeeMessage {
  return {
    version: 1,
    type: MessageType.confirmLockee,
    pendingLockId: pendingLockId,
    acceptMessage
  }
}

@model('consento/consentos/BecomeLockee')
export class ConsentoBecomeLockee extends Model({
  relation: tProp(types.ref<Relation>()),
  receiver: tProp(types.maybeNull(types.model<Receiver>(Receiver)), () => null),
  sender: tProp(types.maybeNull(types.model<Sender>(Sender)), () => null),
  acceptHandshakeJSON: prop<IHandshakeAcceptJSON>(),
  pendingLockId: tProp(types.maybeNull(types.string)),
  shareHex: tProp(types.maybeNull(types.string), () => null),
  creationTime: tProp(types.number, () => Date.now()),
  vaultName: tProp(types.string),
  deleted: tProp(types.boolean, () => false)
}) {
  _lock = observable.box<boolean>(false)

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
    const api = requireAPI(this)
    if (this.isLocked) {
      return
    }
    if (this.isReceivingConfirmation) {
      return
    }
    if (this.state === TRequestState.active) {
      return () => {
        this._lock.set(true)
        ;(async () => {
          const accept = this.acceptHandshake
          this._setReceiveConfirmation(true)
          await api.notifications.send(accept.sender, confirmLockeeMessage(this.pendingLockId, accept.acceptMessage))
        })().then(
          () => {
            this._lock.set(false)
          },
          acceptError => {
            this._setReceiveConfirmation(false)
            this._lock.set(false)
            console.error(acceptError)
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
  relation: tProp(types.ref<Relation>()),
  vault: tProp(types.ref<Vault>())
}) {
  get receiver (): Receiver {
    return null
  }

  static KEEP_ALIVE: number = 5000
}

export type IAnyConsento = ConsentoUnlockVault | ConsentoBecomeLockee
