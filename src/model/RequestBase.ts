import { computed } from 'mobx'
import { tProp, model, modelAction, Model, types, modelIdKey, BaseModel } from 'mobx-keystone'

export enum TRequestState {
  deleted = 'deleted',
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

@model('RequestBase')
export class RequestBase extends Model({
  time: tProp(types.number, () => Date.now()),
  keepAlive: tProp(types.number),
  accepted: tProp(types.maybe(types.number)),
  denied: tProp(types.maybe(types.number)),
  cancelled: tProp(types.maybe(types.number))
}) {
  @modelAction accept (): boolean {
    if (this.isActive) {
      this.cancelled = Date.now()
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
      this.cancelled = Date.now()
      return true
    }
    return false
  }

  @computed get state (): TRequestState {
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
  }

  get expiration (): number {
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

/*
export function RequestBase <AdditionalProps extends { [key: string]: ModelProp<any, any, any> }> (
  modelName: string,
  defaultKeepAlive: number,
  additionalProps?: AdditionalProps
) {
  class CustomRequestClass extends Model({
    time: tProp(types.number, () => Date.now()),
    keepAlive: tProp(types.number, defaultKeepAlive),
    accepted: tProp(types.maybe(types.number)),
    denied: tProp(types.maybe(types.number)),
    cancelled: tProp(types.maybe(types.number)),
    ...additionalProps
  }) {
    cancel: () => boolean
    accept: () => boolean
    deny: () => boolean
    _state: IComputedValue<TRequestState>

    onInit (): void {
      Object.defineProperties(this, {
        accept: modelAction(this, 'accept', {
          value: () => {
            if (this.isActive) {
              this.cancelled = Date.now()
              return true
            }
            return false
          }
        }) as any as PropertyDescriptor,
        cancel: modelAction(this, 'cancel', {
          value: () => {
            if (this.isActive) {
              this.cancelled = Date.now()
              return true
            }
            return false
          }
        }) as any as PropertyDescriptor,
        deny: modelAction(this, 'deny', {
          value: () => {
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
        // TODO: Timeouts need to be handled differently, react-native limitation
        // setTimeout(
        //   () => this._state.get(),
        //   this.expiration - Date.now()
        // )
      }
    }

    get expiration (): number {
      return this.time + this.keepAlive
    }

    get state (): TRequestState {
      return this._state.get()
    }

    get isActive (): boolean {
      return this._state.get() === TRequestState.active
    }

    get isExpired (): boolean {
      return this._state.get() === TRequestState.expired
    }

    get isAccepted (): boolean {
      return this._state.get() === TRequestState.accepted
    }

    get isCancelled (): boolean {
      return this._state.get() === TRequestState.cancelled
    }

    get isDenied (): boolean {
      return this._state.get() === TRequestState.denied
    }
  }
  return model(modelName)(CustomRequestClass)
}
*/
