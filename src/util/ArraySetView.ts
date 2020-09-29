import { computed, IObservableArray, isObservableArray } from 'mobx'
import { ArraySet } from 'mobx-keystone'
import { computedFn } from 'mobx-utils'

export type IFilter <TItem> = (item: TItem) => boolean
export type ISort <TItem = any> = (a: TItem, b: TItem) => 0 | 1 | -1
export interface IArrayViewOptions <TItem> {
  start?: number
  limit?: number
  filter?: IFilter<TItem>
  sort?: ISort<TItem>
}

const equalMapping = (a: number[], b: number[]): boolean => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export class ObservableArrayView <TItem> {
  private readonly array: IObservableArray<TItem>
  private readonly start: number
  private readonly limit: number
  private readonly filter: ((item: TItem) => boolean) | undefined
  private readonly sort: ISort<TItem> | undefined
  item: (index: number) => TItem

  constructor (array: IObservableArray<TItem>, opts?: IArrayViewOptions<TItem>) {
    this.array = array
    this.start = (opts?.start === 0 || (opts?.start ?? 0) > 0) ? opts?.start ?? 0 : 0
    this.limit = opts?.limit === undefined || opts?.limit === -1 ? Infinity : Math.max(opts?.limit ?? 0, 0)
    this.filter = opts?.filter
    this.sort = opts?.sort
    this.item = computedFn((index: number): TItem => array[index], { keepAlive: true })
  }

  @computed({ equals: equalMapping })
  get mapping (): number[] {
    if (this.limit === 0) {
      return []
    }
    const sort = this.sort
    const filter = this.filter
    if (sort !== undefined) {
      let result = this.array.map((_, index) => index)
      if (filter !== undefined) {
        result = result.filter(index => filter(this.array[index]))
      }
      const end = Math.min(this.start + this.limit, this.array.length)
      result.sort((a, b) => sort(this.array[a], this.array[b]))
      if (this.start > 0 || (isFinite(end) && end < this.array.length)) {
        result = result.slice(this.start, end)
      }
      return result
    }
    const result: number[] = []
    if (filter !== undefined) {
      for (let i = this.start, count = 0; count < this.limit && i < this.array.length; i++) {
        const item = this.array[i]
        if (!filter(item)) {
          continue
        }
        result.push(i)
        count++
      }
    } else {
      const end = Math.min(this.start + this.limit, this.array.length)
      for (let i = this.start; i < end; i++) {
        result.push(i)
      }
    }
    return result
  }

  get items (): TItem[] {
    return this.mapping.map(index => this.item(index))
  }

  get size (): number {
    return this.items.length
  }

  [Symbol.iterator] (): Iterator<TItem> {
    return this.items[Symbol.iterator]()
  }
}

export class ArraySetView <TItem> extends ObservableArrayView <TItem> {
  constructor (arraySet: ArraySet<TItem>, opts?: IArrayViewOptions<TItem>) {
    super(arraySet.items as IObservableArray, opts)
  }
}

export type ISupportedArray <TItem> = ArraySet<TItem> | IObservableArray<TItem>

export function createView <TItem> (array: ISupportedArray<TItem>, opts?: IArrayViewOptions<TItem>): ObservableArrayView<TItem> {
  if (isObservableArray(array)) {
    return new ObservableArrayView(array, opts)
  }
  return new ArraySetView(array, opts)
}
