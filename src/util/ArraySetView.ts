import { computed, IComputedValue, IObservableArray, IObservableValue, isObservableArray, observable } from 'mobx'
import { ArraySet } from 'mobx-keystone'
import { computedFn } from 'mobx-utils'
import { exists } from '../styles/util/lang'
import { generateId } from './generateId'

export interface IFilter <TItem> { run: (item: TItem) => boolean, key: string }
export interface ISort <TItem = any> { run: (a: TItem, b: TItem) => number, key: string }
export interface IMap <TInput, TOutput> { run: (input: TInput) => TOutput, key: string }
export interface IArrayViewOptions <TSource, TFinal = TSource> {
  start?: number
  limit?: number
  filter?: IFilter<TSource>
  sort?: ISort<TSource>
  map?: IMap<TSource, TFinal>
}

const equalMapping = (a: number[], b: number[]): boolean => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export interface IArrayView <TItem> extends Iterable<TItem> {
  readonly start: IObservableValue<number>
  readonly limit: IObservableValue<number>
  item: (index: number) => TItem
  [Symbol.iterator]: () => Iterator<TItem, undefined>
  readonly _mapping: number[]
  readonly size: number
  readonly key: IComputedValue<string>
}

function seq (start: number, length: number): number[] {
  const result = new Array<number>(length)
  for (let i = 0; i < length; i++) {
    result[i] = start + i
  }
  return result
}

function createMapping <TSource, TFinal = TSource> (length: number, item: (index: number) => TSource, limit: number, start: number, opts?: IArrayViewOptions<TSource, TFinal>): number[] {
  if (limit === 0) {
    return []
  }
  const sort = opts?.sort
  const filter = opts?.filter
  if (sort !== undefined) {
    let result = seq(0, length)
    if (filter !== undefined) {
      result = result.filter(index => filter.run(item(index)))
    }
    const end = start + limit
    result.sort((a, b) => sort.run(item(a), item(b)))
    if (start > 0 || (isFinite(end) && end < result.length)) {
      result = result.slice(start, end)
    }
    return result
  }
  if (filter !== undefined) {
    const result: number[] = []
    for (let i = start, count = 0; count < limit && i < length; i++) {
      if (!filter.run(item(i))) {
        continue
      }
      result.push(i)
      count++
    }
    return result
  }
  return seq(start, Math.min(limit, length - start))
}

abstract class BaseArrayView <TSource, TFinal> implements IArrayView<TFinal> {
  readonly start: IObservableValue<number>
  readonly limit: IObservableValue<number>
  readonly opts?: IArrayViewOptions<TSource, TFinal>
  readonly item: (index: number) => TFinal
  private readonly _lookup: (index: number) => TSource
  private readonly _length: () => number
  readonly key: IComputedValue<string>

  constructor (key: string | IComputedValue<string>, length: () => number, lookup: (index: number) => TSource, opts?: IArrayViewOptions<TSource, TFinal>) {
    this.start = observable.box((opts?.start === 0 || (opts?.start ?? 0) > 0) ? opts?.start ?? 0 : 0)
    this.limit = observable.box(opts?.limit === undefined || opts?.limit === -1 ? Infinity : Math.max(opts?.limit ?? 0, 0))
    this.opts = opts
    this._lookup = lookup
    this._length = length
    this.key = computed(() => JSON.stringify({
      key: typeof key === 'string' ? key : key.get(),
      start: this.start.get(),
      limit: this.limit.get(),
      filter: this.opts?.filter?.key ?? undefined,
      sort: this.opts?.sort?.key ?? undefined,
      map: this.opts?.map?.key ?? undefined
    }))
    const map = opts?.map
    const mapLookup = (index: number): TSource => lookup(this._mapping[index])
    this.item = computedFn(
      map !== undefined
        ? (item: number) => map.run(mapLookup(item))
        : mapLookup as unknown as (item: number) => TFinal
      , { keepAlive: true }
    )
  }

  @computed({ equals: equalMapping })
  get _mapping (): number[] {
    return createMapping(this._length(), this._lookup, this.limit.get(), this.start.get(), this.opts)
  }

  get size (): number {
    return this._mapping.length
  }

  [Symbol.iterator] (): Iterator<TFinal, undefined> {
    let index = 0
    let done = false
    return {
      next: (): IteratorResult<TFinal, undefined> => {
        if (index >= this.size) {
          done = true
        }
        if (done) {
          return { done, value: undefined }
        }
        return { done, value: this.item(index++) }
      }
    }
  }
}

const randomIdCache = new WeakMap<ISupportedArray<any>, IComputedValue<string> | string>()
function getPrefix (array: ISupportedArray<any>): IComputedValue<string> | string {
  if (isObservableArray(array)) return 'os'
  if (isArrayView(array)) return array.key
  if (array instanceof ArraySet) return array.$modelId
  return 'av'
}

export function getArrayId (array: ISupportedArray<any>): IComputedValue<string> | string {
  let id = randomIdCache.get(array)
  if (id === undefined) {
    const prefix = getPrefix(array)
    const generated = generateId()
    if (typeof prefix === 'string') {
      id = `${prefix}_${generated}`
    } else {
      id = computed(() => `${prefix.get()}_${generated}`)
    }
    randomIdCache.set(array, id)
  }
  return id
}

export class ObservableArrayView <TSource, TFinal = TSource> extends BaseArrayView<TSource, TFinal> {
  constructor (array: IObservableArray<TSource>, opts?: IArrayViewOptions<TSource, TFinal>) {
    super(getArrayId(array), () => array.length, index => array[index], opts)
  }
}

export class ArraySetView <TSource, TFinal = TSource> extends BaseArrayView <TSource, TFinal> {
  constructor (arraySet: ArraySet<TSource>, opts?: IArrayViewOptions<TSource, TFinal>) {
    super(getArrayId(arraySet), () => arraySet.size, index => arraySet.items[index], opts)
  }
}

export class ArrayView <TSource, TFinal = TSource> extends BaseArrayView <TSource, TFinal> {
  constructor (arraySet: ArrayLike<TSource>, opts?: IArrayViewOptions<TSource, TFinal>) {
    super(getArrayId(arraySet), () => arraySet.length, index => arraySet[index], opts)
  }
}

export class DerivedView <TSource, TFinal = TSource> extends BaseArrayView<TSource, TFinal> {
  constructor (array: IArrayView<TSource>, opts?: IArrayViewOptions<TSource, TFinal>) {
    super(getArrayId(array), () => array.size, index => array.item(index), opts)
  }
}

export type ISupportedArray <TItem> = ArraySet<TItem> | IObservableArray<TItem> | IArrayView<TItem> | ArrayLike<TItem>

export function isArrayView <TItem> (input: ISupportedArray<TItem>): input is IArrayView<TItem> {
  if (input instanceof BaseArrayView) return true
  // TODO: Maybe add comprehensive interface implementation tests
  return false
}

export function createView <TSource, TFinal = TSource> (array: ISupportedArray<TSource>, opts?: IArrayViewOptions<TSource, TFinal>): IArrayView<TFinal> {
  if (isObservableArray(array)) {
    return new ObservableArrayView(array, opts)
  }
  if (isArrayView(array)) {
    if (opts === undefined || opts === null || !isFilled(opts)) {
      return array as unknown as IArrayView<TFinal>
    }
    return new DerivedView(array, opts)
  }
  if (array instanceof ArraySet) {
    return new ArraySetView(array, opts)
  }
  return new ArrayView(array, opts)
}

function isFilled (opts: Record<any, any>): boolean {
  for (const key in opts) {
    if (exists(opts[key])) {
      return true
    }
  }
  return false
}

export function deriveView <TSource, TFinal = TSource> (view: IArrayView<TSource>, opts?: IArrayViewOptions<TSource, TFinal>): IArrayView<TFinal> {
  if (opts === undefined || opts === null || !isFilled(opts)) {
    return view as unknown as IArrayView<TFinal>
  }
  return new DerivedView(view, opts)
}
