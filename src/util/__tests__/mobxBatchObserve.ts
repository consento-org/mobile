import { mobxBatchObserveMapAsync, IMapDidChangeBatch } from '../mobxBatchObserve'
import { observable, ObservableMap } from 'mobx'

// eslint-disable-next-line @typescript-eslint/promise-function-async
function time (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function toMap <V> (record: Record<string | number, V>): Map<string | number, V> {
  return new Map(Object.entries(record))
}

type IBatches = Array<IMapDidChangeBatch<string, number>>

interface IBatchingSetup {
  batches: IBatches
  map: ObservableMap<string, number>
  dispose: () => void
}

describe('basic batching', () => {
  function setup (): IBatchingSetup {
    const batches: IBatches = []
    const map = observable.map(new Map<string, number>())
    const reallyDispose = mobxBatchObserveMapAsync(map, async batch => {
      batches.push(batch)
      await time(5)
    })
    return {
      batches,
      map,
      dispose: async () => {
        await time(15) // IMPORTANT: without waiting for a bit, the last operation is not executed!
        await reallyDispose()
      }
    }
  }
  it('adds everything after first to a batch', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.set('b', 2)
    map.set('c', 3)
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) },
      { add: toMap({ b: 2, c: 3 }) }
    ])
  })
  it('records deletions', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.delete('a')
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) },
      { del: toMap({ a: 1 }) }
    ])
  })
  it('records updates', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.set('a', 2)
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) },
      { update: toMap({ a: { newValue: 2, oldValue: 1 } }) }
    ])
  })
  it('skip removed entries', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.set('b', 2)
    map.delete('b')
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) }
    ])
  })
  it('skips reversed updates', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.set('a', 2)
    map.set('a', 1)
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) }
    ])
  })
  it('skips reversed add', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.set('b', 2)
    map.delete('b')
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) }
    ])
  })
  it('corrects double updates', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.set('a', 2)
    map.set('a', 3)
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) },
      { update: toMap({ a: { newValue: 3, oldValue: 1 } }) }
    ])
  })
  it('corrects double updates', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.set('a', 2)
    map.set('a', 3)
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) },
      { update: toMap({ a: { newValue: 3, oldValue: 1 } }) }
    ])
  })
  it('turns double updates into add if previously unregistered', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.set('b', 1)
    map.set('b', 2)
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) },
      { add: toMap({ b: 2 }) }
    ])
  })
  it('turns add into update if deleted before', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.delete('a')
    map.set('a', 2)
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) },
      { update: toMap({ a: { newValue: 2, oldValue: 1 } }) }
    ])
  })
  it('uses correct delete value with update', async () => {
    const { map, batches, dispose } = setup()
    map.set('a', 1)
    map.set('a', 2)
    map.delete('a')
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) },
      { del: toMap({ a: 1 }) }
    ])
  })
})
describe('advanced async', () => {
  it('it will cancel an operation using an abort signal', async () => {
    const map = observable.map()
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    const dispose = mobxBatchObserveMapAsync(map, (_, signal): Promise<void> => {
      return new Promise(resolve => {
        signal.addEventListener('abort', () => resolve())
      })
    })
    map.set('a', 1)
    await dispose()
  })
  it('it will not process outstanding batches on dispose', async () => {
    const map = observable.map()
    const batches: IBatches = []
    const dispose = mobxBatchObserveMapAsync(map, async (batch): Promise<void> => {
      batches.push(batch)
    })
    map.set('a', 1)
    map.set('b', 1)
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1 }) }
    ])
  })
  it('it will wait for timeout if timeout is given', async () => {
    const map = observable.map()
    const batches: IBatches = []
    const dispose = mobxBatchObserveMapAsync(map, async (batch): Promise<void> => {
      batches.push(batch)
    }, { delay: 10 })
    map.set('a', 1)
    map.set('b', 2)
    await time(20)
    map.set('c', 3)
    map.set('d', 4)
    await time(20)
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1, b: 2 }) },
      { add: toMap({ c: 3, d: 4 }) }
    ])
  })
  it('it will skip timeout if given limit is reached', async () => {
    const map = observable.map()
    const batches: IBatches = []
    const dispose = mobxBatchObserveMapAsync(map, async (batch): Promise<void> => {
      batches.push(batch)
    }, { delay: { time: 10, limit: 2 } })
    map.set('a', 1)
    map.set('b', 2) // this will trigger the batch as two operations are running now
    map.set('c', 3) // this will be part of the next batch
    await time(15) // waiting long enough for a new batch
    map.set('d', 4)
    map.set('e', 5) // next batch cut-off
    map.set('f', 6) // ignored due to dispose
    await dispose()
    expect(batches).toEqual([
      { add: toMap({ a: 1, b: 2 }) },
      { add: toMap({ c: 3 }) },
      { add: toMap({ d: 4, e: 5 }) }
    ])
  })
  it('it will use timeout starting from the end of batch not when the change is triggered', async () => {
    const map = observable.map()
    const batches: IBatches = []
    const dispose = mobxBatchObserveMapAsync(map, async (batch) => {
      batches.push(batch)
      await time(11)
    }, { delay: 8 })
    map.set('a', 1)
    await time(15)
    /**
     * first trigger 8ms + duration of first run 11 ms => 19ms
     * now 15ms in, the implementation could take either route:
     *
     * a) it could start a 8ms timeout triggering the next collection at 23ms
     * b) it could mark it as dirty and start the next collection right after 19ms
     * c) It could start a new timeout after the batch is finished 27ms
     */
    map.set('b', 2)
    await time(6)
    /**
     * now 21ms in c...
     *
     * a) will be part of the second batch
     * b) will be part of the third batch, the third batch starting at ms 30
     * c) will be part of the second batch
     */
    map.set('c', 3)
    await time(5)
    /**
     * now 26ms in d...
     *
     * a) will be part of the third batch, triggering next collection at ms 34
     * b) will be part of the third batch
     * c) will be part of the second batch
     */
    map.set('d', 4)
    await time(30)
    await dispose()
    const optionA = [
      { add: toMap({ a: 1 }) },
      { add: toMap({ b: 2, c: 3 }) },
      { add: toMap({ d: 4 }) }
    ]
    const optionB = [
      { add: toMap({ a: 1 }) },
      { add: toMap({ b: 2 }) },
      { add: toMap({ c: 3, d: 4 }) }
    ]
    const optionC = [
      { add: toMap({ a: 1 }) },
      { add: toMap({ b: 2, c: 3, d: 4 }) }
    ]
    expect(batches).toEqual(optionA)
    expect(batches).not.toEqual(optionB)
    expect(batches).not.toEqual(optionC)
  })
})
