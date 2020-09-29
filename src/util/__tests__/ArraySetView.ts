/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArraySetView, ObservableArrayView } from '../ArraySetView'
import { ArraySet } from 'mobx-keystone'
import { action, autorun, observable } from 'mobx'

const sort = (a: string, b: string): 0 | 1 | -1 => a < b ? 1 : -1
const filter = (input: string): boolean => input !== 'b'

describe('simple view on an array', () => {
  it('properly applies a filter', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { filter })
    expect(view.mapping).toEqual([0, 2])
  })
  it('sorts the view without modifying the original', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { sort })
    expect(view.mapping).toEqual([2, 1, 0])
    expect(array.items).toEqual(['a', 'b', 'c'])
    expect(Array.from(view)).toEqual(['c', 'b', 'a'])
  })
  it('can combine filter with sorting', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { filter, sort })
    expect(view.mapping).toEqual([2, 0])
    expect(array.items).toEqual(['a', 'b', 'c'])
    expect(Array.from(view)).toEqual(['c', 'a'])
  })
  it('allows for a start offset', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { start: 1 })
    expect(view.mapping).toEqual([1, 2])
    expect(Array.from(view)).toEqual(['b', 'c'])
  })
  it('allows for a start offset with filter', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { start: 1, filter })
    expect(view.mapping).toEqual([2])
    expect(Array.from(view)).toEqual(['c'])
  })
  it('allows for a start offset with sort', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { start: 1, sort })
    expect(view.mapping).toEqual([1, 0])
    expect(Array.from(view)).toEqual(['b', 'a'])
  })
  it('allows for a start offset with sort & filter', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { start: 1, sort, filter })
    expect(view.mapping).toEqual([0])
    expect(Array.from(view)).toEqual(['a'])
  })
  it('allows for a limit', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { limit: 2 })
    expect(view.mapping).toEqual([0, 1])
    expect(Array.from(view)).toEqual(['a', 'b'])
  })
  it('allows for a limit with filter', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c', 'd'] })
    const view = new ArraySetView<string>(array, { limit: 2, filter })
    expect(view.mapping).toEqual([0, 2])
    expect(Array.from(view)).toEqual(['a', 'c'])
  })
  it('allows for a limit with sort & filter', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c', 'd'] })
    const view = new ArraySetView<string>(array, { limit: 2, sort, filter })
    expect(view.mapping).toEqual([3, 2])
    expect(Array.from(view)).toEqual(['d', 'c'])
  })
  it('allows limit and start simultaneously', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { start: 1, limit: 1 })
    expect(view.mapping).toEqual([1])
    expect(Array.from(view)).toEqual(['b'])
  })
  it('allows for limits higher than the length of the array ', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { limit: 5 })
    expect(view.mapping).toEqual([0, 1, 2])
    expect(Array.from(view)).toEqual(['a', 'b', 'c'])
  })
  it('allows for 0 limits ', () => {
    const array = new ArraySet<string>({ items: ['a', 'b', 'c'] })
    const view = new ArraySetView<string>(array, { limit: 0 })
    expect(view.mapping).toEqual([])
    expect(Array.from(view)).toEqual([])
  })
})

describe('updating an array', () => {
  let x: any
  let log: string[]
  const add = (entry: string): any => log.push(entry)
  it('basically works', () => {
    log = []
    const arr = new ArraySet<number>({})
    const view = new ArraySetView(arr)
    const clear = autorun(() => {
      add('autorun')
      x = view.size
    })
    try {
      add('add-1')
      arr.add(1)
      add('add-2')
      arr.add(2)
      expect(log).toEqual(['autorun', 'add-1', 'autorun', 'add-2', 'autorun'])
    } finally {
      clear()
    }
  })
  it('will not trigger an update for elements added when limit is reached', () => {
    log = []
    const arr = new ArraySet<string>({ items: ['a', 'b'] })
    const view = new ArraySetView<string>(arr, { limit: 3 })
    const clear = autorun(() => {
      log.push('autorun')
      x = Array.from(view)
    })
    try {
      add('add-1')
      arr.add('c')
      add('add-2')
      arr.add('d')
      expect(log).toEqual(['autorun', 'add-1', 'autorun', 'add-2'])
    } finally {
      clear()
    }
  })
  it('will not trigger an update when a filtered element is added', () => {
    log = []
    const arr = new ArraySet<string>({ items: ['a', 'c'] })
    const view = new ArraySetView<string>(arr, { filter })
    const clear = autorun(() => {
      log.push('autorun')
      x = Array.from(view)
    })
    try {
      add('add-1')
      arr.add('b')
      add('add-2')
      arr.add('e')
      expect(log).toEqual(['autorun', 'add-1', 'add-2', 'autorun'])
    } finally {
      clear()
    }
  })
  it('will trigger if an item is replaced', () => {
    log = []
    const arr = observable.array(['a', 'c'])
    const view = new ObservableArrayView<string>(arr, {})
    const clear = autorun(() => {
      log.push('autorun')
      x = Array.from(view)
    })
    try {
      add('splice')
      arr.splice(0, 1, 'b')
      expect(Array.from(view)).toEqual(['b', 'c'])
      expect(log).toEqual(['autorun', 'splice', 'autorun'])
    } finally {
      clear()
    }
  })
})
