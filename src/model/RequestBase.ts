import { IComputedValue, computed, action } from 'mobx'
import { tProp, model, Model, types, modelIdKey, BaseModel, ModelProps, AnyModel, ModelClass, ModelProp, modelAction } from 'mobx-keystone'

export enum TRequestState {
  accepted = 'accepted',
  denied = 'denied',
  cancelled = 'cancelled',
  expired = 'expired',
  active = 'active'
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

export function RequestBase (modelName: string, defaultKeepAlive: number, additionalProps?: { [key: string]: ModelProp<any, any, any> }) {
  const m = model(modelName)(class extends Model({
    time: tProp(types.number, () => Date.now()),
    keepAlive: tProp(types.number, defaultKeepAlive),
    accepted: tProp(types.maybe(types.number)),
    denied: tProp(types.maybe(types.number)),
    cancelled: tProp(types.maybe(types.number)),
    ... additionalProps
  }) {
    cancel: () => boolean
    accept: () => boolean
    deny: () => boolean
    _state: IComputedValue<TRequestState>
    onInit () {
      Object.defineProperties(this, {
        accept: modelAction(this, 'accept', {
          value () {
            if (this.isActive) {
              this.cancelled = Date.now()
              return true
            }
            return false
          }
        }) as any as PropertyDescriptor,
        cancel: modelAction(this, 'cancel', {
          value () {
            if (this.isActive) {
              this.cancelled = Date.now()
              return true
            }
            return false
          }
        }) as any as PropertyDescriptor,
        deny: modelAction(this, 'deny', {
          value () {
            if (this.isActive) {
              this.cancelled = Date.now()
              return true
            }
            return false
          }
        }) as any as PropertyDescriptor
      })
      this._state = computed.call(this, (): TRequestState => {
        if (this.cancelled !== undefined) {
          return TRequestState.cancelled
        }
        if (this.denied !== undefined) {
          return TRequestState.denied
        }
        if (this.accepted !== undefined) {
          return TRequestState.accepted
        }
        if (Date.now() > this.expiration) {
          return TRequestState.expired
        }
        return TRequestState.active
      })
      if (this.isActive) {
        /*
        TODO: Timeouts need to be handled differently, react-native limitation
        setTimeout(
          () => this._state.get(),
          this.expiration - Date.now()
        )
        */
      }
    }
    get expiration () {
      return this.time + this.keepAlive
    }
    get state () {
      return this._state.get()
    }
    get isActive () {
      return this._state.get() === TRequestState.active
    }
    get isExpired () {
      return this._state.get() === TRequestState.expired
    }
    get isAccepted () {
      return this._state.get() === TRequestState.accepted
    }
    get isCancelled () {
      return this._state.get() === TRequestState.cancelled
    }
    get isDenied () {
      return this._state.get() === TRequestState.denied
    }
  })
  return m
}