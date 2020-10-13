import { computed, IObservableArray, IObservableValue, isObservableArray, observable } from 'mobx'
import { ArraySet } from 'mobx-keystone'
import { computedFn } from 'mobx-utils'
import { exists } from '../styles/util/lang'

export type IFilter <TItem> = (item: TItem) => boolean
export type ISort <TItem = any> = (a: TItem, b: TItem) => number
export type IMap <TInput, TOutput> = (input: TInput) => TOutput
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
      result = result.filter(index => filter(item(index)))
    }
    const end = start + limit
    result.sort((a, b) => sort(item(a), item(b)))
    if (start > 0 || (isFinite(end) && end < result.length)) {
      result = result.slice(start, end)
    }
    return result
  }
  if (filter !== undefined) {
    const result: number[] = []
    for (let i = start, count = 0; count < limit && i < length; i++) {
      if (!filter(item(i))) {
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

  constructor (length: () => number, lookup: (index: number) => TSource, opts?: IArrayViewOptions<TSource, TFinal>) {
    this.start = observable.box((opts?.start === 0 || (opts?.start ?? 0) > 0) ? opts?.start ?? 0 : 0)
    this.limit = observable.box(opts?.limit === undefined || opts?.limit === -1 ? Infinity : Math.max(opts?.limit ?? 0, 0))
    this.opts = opts
    this._lookup = lookup
    this._length = length
    const map = opts?.map
    const mapLookup = (index: number): TSource => lookup(this._mapping[index])
    this.item = computedFn(
      map !== undefined
        ? (item: number) => map(mapLookup(item))
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

export class ObservableArrayView <TSource, TFinal = TSource> extends BaseArrayView<TSource, TFinal> {
  constructor (array: IObservableArray<TSource>, opts?: IArrayViewOptions<TSource, TFinal>) {
    super(() => array.length, index => array[index], opts)
  }
}

export class ArraySetView <TSource, TFinal = TSource> extends BaseArrayView <TSource, TFinal> {
  constructor (arraySet: ArraySet<TSource>, opts?: IArrayViewOptions<TSource, TFinal>) {
    super(() => arraySet.size, index => arraySet.items[index], opts)
  }
}

export class ArrayView <TSource, TFinal = TSource> extends BaseArrayView <TSource, TFinal> {
  constructor (arraySet: ArrayLike<TSource>, opts?: IArrayViewOptions<TSource, TFinal>) {
    super(() => arraySet.length, index => arraySet[index], opts)
  }
}

export class DerivedView <TSource, TFinal = TSource> extends BaseArrayView<TSource, TFinal> {
  constructor (array: IArrayView<TSource>, opts?: IArrayViewOptions<TSource, TFinal>) {
    super(() => array.size, index => array.item(index), opts)
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
