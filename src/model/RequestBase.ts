import { computed } from 'mobx'
import { tProp, model, modelAction, Model, types, modelIdKey, BaseModel } from 'mobx-keystone'
import { now } from './now'

export enum TRequestState {
  accepted = 'accepted', // When "accept" on a request is pressed
  confirmed = 'confirmed', // When the "accept" call is confirmed by the other party
  denied = 'denied', // When the "deny" on the request is pressed
  cancelled = 'cancelled', // When the other party cancelled the request
  expired = 'expired', // When the request expired
  active = 'active' // When the hasn't expired yet and is active
}

export interface IRequestBase extends BaseModel<any, any> {
  cancel(): boolean
  accept(): boolean
  deny(): boolean
  readonly time: number
  readonly keepAlive: number
  readonly accepted: number | undefined
  readonly denied: number | undefined
  readonly cancelled: number | undefined
  readonly isActive: boolean
  readonly isDenied: boolean
  readonly isCancelled: boolean
  readonly isExpired: boolean
  readonly isAccepted: boolean
  readonly state: TRequestState
}

export interface IRequestOpts {
  time?: number
  keepAlive?: number
  accepted?: number
  denied?: number
  cancelled?: number
  [modelIdKey]?: string
}

@model('RequestBase')
export class RequestBase extends Model({
  time: tProp(types.number, () => Date.now()),
  keepAlive: tProp(types.number),
  accepted: tProp(types.maybeNull(types.number), () => null),
  denied: tProp(types.maybeNull(types.number), () => null),
  confirmed: tProp(types.maybeNull(types.number), () => null),
  cancelled: tProp(types.maybeNull(types.number), () => null),
  deleted: tProp(types.boolean, () => false)
}) {
  get creationTime (): number {
    return this.time
  }

  @modelAction accept (): boolean {
    if (this.isActive) {
      this.accepted = Date.now()
      return true
    }
    return false
  }

  @modelAction cancel (): boolean {
    if (this.isActive) {
      this.cancelled = Date.now()
      return true
    }
    return false
  }

  @modelAction deny (): boolean {
    if (this.isActive) {
      this.denied = Date.now()
      return true
    }
    return false
  }

  acceptAndConfirm (): boolean {
    this.accept()
    return this.confirm()
  }

  @modelAction confirm (): boolean {
    if (this.isAccepted) {
      this.confirmed = Date.now()
      return true
    }
    return false
  }

  @computed get expiresIn (): number {
    return this.expiration - now()
  }

  @computed get state (): TRequestState {
    if (this.cancelled !== null) {
      return TRequestState.cancelled
    }
    if (this.confirmed !== null) {
      return TRequestState.confirmed
    }
    if (this.denied !== null) {
      return TRequestState.denied
    }
    if (this.accepted !== null) {
      return TRequestState.accepted
    }
    if (this.expiresIn <= 0) {
      return TRequestState.expired
    }
    return TRequestState.active
  }

  @computed get expiration (): number {
    return this.time + this.keepAlive
  }

  get isActive (): boolean {
    return this.state === TRequestState.active
  }

  get isExpired (): boolean {
    return this.state === TRequestState.expired
  }

  get isAccepted (): boolean {
    return this.state === TRequestState.accepted
  }

  get isCancelled (): boolean {
    return this.state === TRequestState.cancelled
  }

  get isDenied (): boolean {
    return this.state === TRequestState.denied
  }
}
