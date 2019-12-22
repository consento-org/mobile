
export interface ICancelable <T = any> extends Promise<T> {
  cancel (): boolean
  then <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): ICancelable<TResult1 | TResult2>
  catch <TResult> (onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): ICancelable<T | TResult>
}
export class CancelError extends Error {
  constructor () {
    super('cancelled')
  }
}

function isPromiseLike (p: any): p is PromiseLike<any> {
  return typeof p === 'object' && typeof p.then === 'function'
}

enum Done {
  not = 1,
  ok = 2,
  err = 3
}

const cancelSymbol = Symbol('cancel')
const include = (cancelable: ICancelable) => {
  return {
    [cancelSymbol]: cancelable
  }
}

const noop = () => {}

let _frameNo = 0
let _next = false

function incrementFrame () {
  _next = false
  _frameNo += 1
}

function frame () {
  if (!_next) {
    _next = true
    setImmediate(incrementFrame)
  }
  return _frameNo
}

class AbstractCancelable <TReturn> extends Promise<TReturn> {
  _rejected: ((error: Error) => void)[]
  _resolved: ((data: TReturn) => void)[]
  _reject: (error: Error) => void
  _resolve: (data: TReturn) => void
  _done: Done = Done.not
  _error: Error
  _data: TReturn
  cancelled: boolean = false
  constructor () {
    super(noop)
    const start = frame()
    const doReject = () => {
      for (const _reject of this._rejected) {
        _reject(this._error)
      }
      this._rejected = undefined
    }
    const doResolve = () => {
      for (const _resolve of this._resolved) {
        _resolve(this._data)
      }
      this._resolved = undefined
    }
    this._reject = (error: Error) => {
      if (this._done !== Done.not) return
      this._done = Done.err
      this._error = error
      if (error instanceof CancelError) {
        this.cancelled = true
      }
      this._resolved = undefined
      if (this._rejected === undefined) return
      if (start === frame()) return setTimeout(doReject, 1)
      doReject()
    }
    this._resolve = (data: TReturn) => {
      if (this._done !== Done.not) return
      this._done = Done.ok
      this._data = data
      this._rejected = undefined
      if (this._resolved === undefined) return
      if (start === frame()) return setTimeout(doResolve, 1)
      doResolve()
    }
  }
  then <TResult3 = TReturn, TResult4 = never>(onfulfilled?: ((value: TReturn) => TResult3 | PromiseLike<TResult3>) | undefined | null, onrejected?: ((reason: any) => TResult4 | PromiseLike<TResult4>) | undefined | null): ICancelable<TResult3 | TResult4> {
    const next = new CancelableWrap (onfulfilled, onrejected)
    if (this._done === Done.not) {
      if (this._rejected === undefined) {
        this._rejected = []
      }
      this._rejected.push(next._receiveError)
      if (this._resolved === undefined) {
        this._resolved = []
      }
      this._resolved.push(next._receiveData)
      next.cancel = () => {
        return this.cancel()
      }
    } else if (this._done === Done.ok) {
      next._receiveData(this._data)
    } else if (this._done === Done.err) {
      next._receiveError(this._error)
    }
    return next
  }
  catch <TResult3> (onrejected?: ((reason: any) => TResult3 | PromiseLike<TResult3>) | undefined | null): ICancelable<TResult3> {
    return this.then(null, onrejected)
  }
  cancel (): boolean {
    if (this._done !== Done.not) return this.cancelled
    this._reject(new CancelError())
    return true
  }
}

export class CancelableWrap <T, TResult1, TResult2 = never> extends AbstractCancelable<TResult1 | TResult2> implements ICancelable<TResult1 | TResult2> {
  _receiveData: (data: T) => void
  _receiveError: (error: Error) => void
  constructor (onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null) {
    super()
    const start = frame()
    const process = (res) => {
      if (isPromiseLike(res)) {
        res.then(
          this._resolve,
          this._reject
        )
      } else {
        this._resolve(res)
      }
    }
    this._receiveError = (error: Error) => {
      if (start === frame()) {
        return setImmediate(this._receiveError, error)
      }
      let res: TResult2 | PromiseLike<TResult2>
      try {
        res = onrejected(error)
      } catch (err) {
        this._reject(err)
        return
      }
      process(res)
    }
    this._receiveData = (data: T) => {
      if (start === frame()) {
        return setImmediate(this._receiveData, data)
      }
      let res: TResult1 | PromiseLike<TResult1> | TResult2 | PromiseLike<TResult2>
      try {
        res = onfulfilled(data)
      } catch (error1) {
        try {
          res = onrejected(error1)
        } catch (error2) {
          return this._reject(error2)
        }
      }
      process(res)
    }
  }
}

export class Cancelable <T = unknown, TReturn = any> extends AbstractCancelable<TReturn> implements ICancelable<TReturn> {
  constructor (generator: (child: (cancelable: ICancelable) => any) => Generator<T, TReturn, any>) {
    super ()
    let iter: Generator<T, TReturn, any>
    try {
      iter = generator(include)
    } catch (error) {
      this._reject(error)
      return
    }
    const process = (next: any): void => {
      while (true) {
        if (typeof next === 'object' && next !== null && next[cancelSymbol] !== undefined) {
          const cancelable = next[cancelSymbol]
          if (this._done !== Done.not) {
            cancelable.cancel()
            return
          }
          const _reject = this._reject
          this._reject = (error: Error) => {
            this._reject = _reject
            _reject(error)
            cancelable.cancel()
          }
          cancelable.then(
            data => {
              this._reject = _reject
              process(data)
            },
            error => {
              this._reject = _reject
              this._reject(error)
            }
          )
          return
        }
        if (this._done !== Done.not) return
        let data: IteratorResult<T, TReturn>
        try {
          data = iter.next(next)
        } catch (error) {
          this._reject(error)
          return
        }
        if (data.value instanceof Promise) {
          data.value.then(process, this._reject)
          return
        }
        if (data.done) {
          this._resolve(data.value)
          return
        }
        next = data.value
      }
    }
    process(undefined)
  }
}

export interface ILegacyCancelable <T = any> {
  cancel (): void
  promise: Promise<T>
}

export class LegacyCancelable <T> extends AbstractCancelable<T> implements ICancelable<T> {
  constructor (legacy: ILegacyCancelable<T>) {
    super ()
    const reject = this._reject
    this._reject = (error: Error) => {
      if (this._done !== Done.not) return
      if (error instanceof CancelError) {
        legacy.cancel()
      }
      reject(error)
    }
    legacy.promise.then(this._resolve, this._reject)
  }
}
