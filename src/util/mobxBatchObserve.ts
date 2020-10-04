import { AbortError } from '@consento/api/util'
import { IMapDidChange, ObservableMap } from 'mobx'

export interface IUpdate<V> {
  oldValue: V
  newValue: V
}
export type IUpdateMap<K, V> = Map<K, IUpdate<V>>

export interface IMapDidChangeBatch<K, V> {
  add?: Map<K, V>
  update?: IUpdateMap<K, V>
  del?: Map<K, V>
}

function errorToConsole (error: Error): void {
  console.error(error)
}

export function mobxBatchObserveMapAsync <K, V> (
  map: ObservableMap<K, V>,
  handleChanges: (batch: IMapDidChangeBatch<K, V>, signal: AbortSignal) => Promise<void>,
  opts: {
    onError?: (error: Error) => void
    delay?: number | {
      limit: number
      time: number
    }
    firstRun?: boolean
  } = {}
): () => Promise<void> {
  const { observer, close, signal } = mobxBatchObserveAsync(handleChanges, opts.onError, opts.delay)
  const unlisten = map.observe(observer)
  if (opts.firstRun === true && map.size > 0) {
    const changes = { add: new Map<K, V>(map) }
    handleChanges(changes, signal)
      .catch(opts.onError ?? errorToConsole)
  }
  return async () => {
    unlisten()
    await close()
  }
}

export function mobxBatchObserveAsync <K, V> (
  handleChanges: (batch: IMapDidChangeBatch<K, V>, signal: AbortSignal) => Promise<void>,
  onError?: (error: Error) => void,
  delay?: number | {
    limit: number
    time: number
  }
): {
    observer: (change: IMapDidChange<K, V>) => void
    signal: AbortSignal
    close: () => Promise<void>
  } {
  const handleError = onError ?? errorToConsole
  const controller = new AbortController()
  let closed = false
  let process: Promise<void> | undefined
  let timeout: ReturnType<typeof setTimeout> | undefined
  const processBatch = (): void => {
    if (closed) return
    if (process !== undefined) return
    if (timeout !== undefined) {
      clearTimeout(timeout)
      timeout = undefined
    }
    const changes = consume()
    if (changes === undefined) {
      return
    }
    process = handleChanges(changes, controller.signal).then(
      () => {
        process = undefined
        if (pending() > 0 && timeout === undefined) {
          processBatch()
        }
      },
      error => {
        process = undefined
        if (closed && error instanceof AbortError) {
          return
        }
        handleError(error)
      }
    )
  }
  const processWithDelay =
    delay === undefined
      ? processBatch
      : typeof delay === 'number'
        ? () => {
          if (timeout === undefined) {
            timeout = setTimeout(processBatch, delay)
          }
        }
        : () => {
          if (pending() >= delay.limit) {
            return processBatch()
          }
          if (timeout === undefined) {
            timeout = setTimeout(processBatch, delay.time)
          }
        }
  const { observer, consume, pending } = mobxBatchObserve<K, V>(() => {
    if (closed) {
      throw new Error('Change triggered after closing observer!')
    }
    processWithDelay()
  })
  return {
    observer,
    signal: controller.signal,
    close: async () => {
      if (closed) {
        throw new Error('Already closed!')
      }
      closed = true
      if (timeout !== undefined) {
        clearTimeout(timeout)
      }
      controller.abort()
    }
  }
}

interface IMapControl <K, V> {
  map?: Map<K, V>
  get: (key: K) => V | undefined
  set: (key: K, value: V) => void
  has: (key: K) => boolean
  del: (key: K) => void
  size: () => number
  consume: () => Map<K, V> | undefined
}

function mapControl <K, V> (): IMapControl<K, V> {
  const result: IMapControl<K, V> = {
    has: key => result.map?.has(key) ?? false,
    get: key => result.map?.get(key),
    del: key => {
      if (result.map === undefined) return
      result.map.delete(key)
      if (result.map.size === 0) {
        result.map = undefined
      }
    },
    set: (key, value) => {
      let map = result.map
      if (map === undefined) {
        map = new Map<K, V>()
        result.map = map
      }
      map.set(key, value)
    },
    consume: () => {
      const consumed = result.map
      if (consumed === undefined) return
      result.map = undefined
      return consumed
    },
    size: () => result.map === undefined ? 0 : result.map.size
  }
  return result
}

export function mobxBatchObserve <K, V> (trigger: () => void): {
  observer: (change: IMapDidChange<K, V>) => void
  consume: () => IMapDidChangeBatch<K, V> | undefined
  pending: () => number
} {
  const add = mapControl<K, V>()
  const update = mapControl<K, IUpdate<V>>()
  const del = mapControl<K, V>()
  function addChange (change: IMapDidChange<K, V>): void {
    const { name } = change
    if (change.type === 'delete') {
      if (add.has(name)) {
        add.del(name)
        return
      }
      let oldValue = change.oldValue
      if (update.has(name)) {
        oldValue = update.get(name)?.oldValue as V
        update.del(name)
      }
      del.set(name, oldValue)
      return
    }
    if (change.type === 'add') {
      if (del.has(name)) {
        update.set(name, {
          newValue: change.newValue,
          oldValue: del.get(name) as V
        })
        del.del(name)
        return
      }
      add.set(name, change.newValue)
      return
    }
    if (change.type === 'update') {
      if (add.has(name)) {
        add.set(name, change.newValue)
        return
      }
      if (update.has(name)) {
        const prev = update.get(name) as IUpdate<V>
        if (prev.oldValue === change.newValue) {
          update.del(name)
          return
        }
        update.set(name, {
          oldValue: prev.oldValue,
          newValue: change.newValue
        })
        return
      }
      update.set(name, {
        newValue: change.newValue,
        oldValue: change.oldValue
      })
    }
  }
  return {
    pending: () => add.size() + update.size() + del.size(),
    consume: () => {
      let result: IMapDidChangeBatch<K, V> | undefined
      result = add.map === undefined ? undefined : { add: add.consume() }
      result = update.map === undefined ? result : { ...result, update: update.consume() }
      result = del.map === undefined ? result : { ...result, del: del.consume() }
      return result
    },
    observer: change => {
      addChange(change)
      trigger()
    }
  }
}
