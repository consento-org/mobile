import { Cancelable, CancelError, LegacyCancelable } from '../Cancelable'

describe('regular use', () => {
  it('can be fulfilled', async () => {
    expect(await new Cancelable(function * () {
      return 'hello'
    })).toBe('hello')
  })
  it('will be fulfilled with delay', async () => {
    let _data
    const p = new Cancelable(function * () {
      return 'hello'
    })
    p.then(data => {
      _data = data
    })
    expect(p._done).toBe(2)
    expect(_data).toBeUndefined()
  })
  it('can be fulfilled repeatedly', async () => {
    const p = new Cancelable(function * () {
      return 'hello'
    })
    expect(await p).toBe('hello')
    expect(await p).toBe('hello')
  })
  it('can be fulfilled with delay', async () => {
    expect(await new Cancelable(function * () {
      return yield new Promise(resolve => setTimeout(resolve, 10, 'hello'))
    })).toBe('hello')
  })
  it('can be fulfilled with multiple steps', async () => {
    expect(
      await new Cancelable(function * () {
        const data = yield Promise.resolve('a')
        return yield Promise.resolve(`${data}b`)
      })
    ).toBe('ab')
  })
  it('can have an error', async () => {
    try {
      await new Cancelable(function * () {
        throw new Error('hello')
      })
      fail('Error should have thrown')
    } catch (err) {
      expect(err.message).toBe('hello')
    }
  })
  it('can an error repeatedly', async () => {
    let _reject: (error: Error) => void
    const p = new Cancelable(function * () {
      yield new Promise((_, reject) => {
        _reject = reject
      })
    })
    let count = 0
    p.catch(err => {
      count += 1
      expect(err.message).toBe('hello')
    })
    p.catch(err => {
      count += 1
      expect(err.message).toBe('hello')
    })
    _reject(new Error('hello'))
    await p.catch(_ => {})
    expect(count).toBe(2)
  })
  it('can have an error in the generation', async () => {
    try {
      await new Cancelable(() => {
        throw new Error('hello')
      })
      fail('error should have thrown')
    } catch (err) {
      expect(err.message).toBe('hello')
    }
  })
  it('can yield a regular string', async () => {
    expect(await new Cancelable(function * () {
      return yield 'hello'
    })).toBe('hello')
  })
  it('can yield a promise string', async () => {
    expect(await new Cancelable(function * () {
      return yield Promise.resolve('hello')
    })).toBe('hello')
  })
  it('can be cancelled', async () => {
    const neverResolve = new Promise(() => {})
    const p = new Cancelable(function * () {
      yield neverResolve
    })
    let _error = false
    const p2 = p.catch(error => {
      _error = true
      expect(error).toBeInstanceOf(CancelError)
    })
    expect(p.cancel()).toBe(true)
    await p2
    expect(_error).toBe(true)
  })
  it('100000 resolved promises dont break the stack', async () => {
    await new Cancelable(function * () {
      for (let i = 0; i < 100000; i++) {
        yield i
      }
    })
  })
})
describe('unexpected responses', () => {
  it('cancel after fulfill', async () => {
    const p = new Cancelable(function * () {
      return 'hi'
    })
    expect(p.cancel()).toBe(false)
    expect(await p).toBe('hi')
  })
  it('cancel after reject', async () => {
    let p: Cancelable
    try {
      p = new Cancelable(function * () {
        throw new Error('hello')
      })
      await p
      fail('error not passed')
    } catch (err) {
      expect(p.cancel()).toBe(false)
    }
  })
  it('fulfill after cancel', async () => {
    let _error: Error
    const p = new Cancelable(function * () {
      return yield new Promise(resolve => setTimeout(resolve, 100, 'hello'))
    })
    const p2 = p.catch(error => {
      _error = error
    })
    expect(p.cancel()).toBe(true)
    await p2
    expect(_error).not.toBe(undefined)
    expect(_error).toBeInstanceOf(CancelError)
  })
  it('throwing an error in error handler', async () => {
    try {
      await new Cancelable(function * () {
        throw new Error('a')
      }).catch(_ => {
        throw new Error('b')
      })
      fail('no error?')
    } catch (err) {
      expect(err.message).toBe('b')
    }
  })
  it('throwing an error in fullfillment', async () => {
    try {
      await new Cancelable(function * () {
        return 'a'
      }).catch(_ => {
        throw new Error('b')
      })
      fail('no error?')
    } catch (err) {
      expect(err.message).toBe('b')
    }
  })
})
describe('chaining', () => {
  it('chained result', async () => {
    expect(
      await (
        new Cancelable(function * () {
          return 'hello'
        })
        .then(data => {
          expect(data).toBe('hello')
          return 'hola'
        })
      )
    ).toBe('hola')
  })
  it('double chaining result', async () => {
    expect(
      await (
        new Cancelable(function * () {
          return 'hello'
        })
        .then(data => {
          expect(data).toBe('hello')
          return Promise.resolve('hola')
        })
      )
    ).toBe('hola')
  })
  it('catching errors', async () => {
    expect(
      await (
        new Cancelable(function * () {
          throw new Error('hello')
        })
        .catch(error => {
          expect(error.message).toBe('hello')
          return 'hola'
        })
      )
    ).toBe('hola')
  })
  it('child cancelables', async () => {
    const theChild = new Cancelable(function * () {
      return new Promise(() => {}) // Never resolve
    })
    const p = new Cancelable(function * (child) {
      return yield child(theChild)
    })
    expect(p.cancel()).toBe(true)
    expect(theChild.cancelled).toBe(true)
  })
  it('fulfill with child', async () => {
    expect(
      await new Cancelable(function * (child) {
        return yield child(new Cancelable(function *() {
          return 'hola'
        }))
      })
    ).toBe('hola')
  })
  it('fulfill after cancel', async () => {
    let _error: Error
    const p1 = new Cancelable(function * () {
      return yield new Promise(resolve => setTimeout(resolve, 10, 'hello'))
    })
    const p2 = p1.catch(error => {
      _error = error
    })
    expect(p2.cancel()).toBe(true)
    expect(p1.cancelled).toBe(true)
    await p2
    expect(_error).not.toBeUndefined()
    expect(_error).toBeInstanceOf(CancelError)
  })
  it('fulfill after cancel with child', async () => {
    let p2: Cancelable
    let _resolve: () => void
    const p1 = new Cancelable(function * (child) {
      return yield new Promise(resolve => {
        p2 = new Cancelable(function * () {
          yield new Promise(resolve => setTimeout(resolve, 100))
        })
        _resolve = () => resolve(child(p2))
      })
    })
    expect(p1.cancel()).toBe(true)
    _resolve()
    try {
      await p2
      fail('should be cancelled')
    } catch (error) {
      expect(error).toBeInstanceOf(CancelError)
    }
  })
  it('resolve after closing', async () => {
    let _resolve: () => void
    const p1 = new Cancelable(function * (child) {
      yield new Promise(resolve => {
        _resolve = resolve
      })
      fail('should not reach here')
    })
    expect(p1.cancel()).toBe(true)
    _resolve()
  })
})
describe('legacy support', () => {
  it('skipping cancel on resolve', async () => {
    const cancel = () => {
      fail('Cancel called')
    }
    const p2 = Promise.resolve('hi')
    const p = new LegacyCancelable({ cancel, promise: p2 })
    await p2
    expect(p.cancel()).toBe(false)
  })
  it('skipping cancel on reject', async () => {
    const cancel = () => {
      fail('Cancel called')
    }
    const p2 = Promise.reject('hi')
    const p = new LegacyCancelable({ cancel, promise: p2 })
    try {
      await p2
    } catch (_) {}
    expect(p.cancel()).toBe(false)
  })
  it('cancelling before error', async () => {
    let called = 0
    const cancel = () => {
      called += 1
    }
    const p2 = Promise.reject('hi')
    const p = new LegacyCancelable({ cancel, promise: p2 })
    expect(p.cancel()).toBe(true)
    try {
      await p2
    } catch (_) {}
    try {
      await p
    } catch (err) {
      expect(err).toBeInstanceOf(CancelError)
    }
    expect(called).toBe(1)
  })
})
