import { createSecureStore, ISecureStore } from '../createSecureStore'
import { friends as crypto } from '@consento/crypto/core/friends'
import { Buffer, bufferToString } from '@consento/crypto/util/buffer'

const jsonEncoding = {
  toBuffer: (entry: any) => Buffer.from(JSON.stringify(entry)),
  fromBuffer: (buffer: Uint8Array) => JSON.parse(bufferToString(buffer))
}
const objectMerge = (index: any, entry: any): any => {
  for (const name in entry) {
    index[name] = entry[name]
  }
  return index
}

async function createStore (secretKey?: Uint8Array, dataStore?: any): Promise<{ store: ISecureStore<any>, dataStore: any, secretKey: Uint8Array }> {
  if (secretKey === undefined) {
    secretKey = await crypto.createSecretKey()
  }
  if (dataStore === undefined) {
    dataStore = {}
  }
  const store = createSecureStore(secretKey, {
    crypto,
    store: {
      // eslint-disable-next-line @typescript-eslint/require-await
      async read (path: string[]): Promise<Uint8Array> {
        return dataStore[path.join('/')]
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      async write (path: string[], part: Uint8Array): Promise<void> {
        dataStore[path.join('/')] = part
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      async list (path: string[]): Promise<string[]> {
        const base = path.join('/') + '/'
        return Object.keys(dataStore).map(entry => {
          if (entry.indexOf(base) === 0) {
            return entry.substr(base.length)
          }
        }).filter(Boolean)
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      async delete (path: string[]): Promise<void> {
        delete dataStore[path.join('/')]
      }
    },
    encoding: jsonEncoding
  })
  return { store, dataStore, secretKey }
}

describe('basic secure storage', () => {
  it('initial condition', async () => {
    const { store } = await createStore()
    expect(await store.root).not.toBe(null)
    expect(await store.version()).toBe(0)
  })

  it('storing an entry', async () => {
    const { store, dataStore, secretKey } = await createStore()
    await store.append({ hello: 'world' })
    expect(await store.version()).toBe(1)

    const firstEntry = `${await store.root}/data/1`
    expect(Object.keys(dataStore)).toEqual([firstEntry])
    expect(bufferToString((await crypto.decrypt(secretKey, dataStore[firstEntry]) as any as Uint8Array))).toBe('{"hello":"world"}')
  })

  it('creating an index', async () => {
    const { store, dataStore } = await createStore()
    await store.append({ hello: 'world' })
    await store.append({ hallo: 'welt' })
    expect(await store.version()).toBe(2)
    const index = store.defineIndex('test', () => ({}), jsonEncoding, (index, entry) => {
      for (const name in entry) {
        index[name] = entry[name]
      }
    })
    expect(await index.read()).toEqual({ hello: 'world', hallo: 'welt' })
    expect(await index.isDirty()).toBe(true)
    expect(Object.keys(dataStore).length).toBe(2)
  })

  it('persisting an index', async () => {
    const { store, dataStore } = await createStore()
    await store.append({ hello: 'world' })
    const index = store.defineIndex('test', () => ({}), jsonEncoding, objectMerge)
    expect(await index.persist())
    expect(await index.isDirty()).toBe(false)
    expect(Object.keys(dataStore).length).toBe(2)
  })

  it('updates to an index', async () => {
    const { store } = await createStore()
    const index = store.defineIndex('test', () => ({}), jsonEncoding, objectMerge)
    expect(await index.isDirty()).toBe(false)
    await store.append({ hello: 'world' })
    await store.append({ hola: 'mundo' })
    expect(await index.isDirty()).toBe(true)
    expect(await index.read()).toEqual({ hello: 'world', hola: 'mundo' })
  })

  it('restoring a partially persisted index', async () => {
    const { store, secretKey, dataStore } = await createStore()
    await store.append({ hello: 'world' })
    const index = store.defineIndex('test', () => ({}), jsonEncoding, objectMerge)
    await index.persist()
    await store.append({ hola: 'mundo' })
    const { store: newStore } = await createStore(secretKey, dataStore)
    expect(await newStore.root).toBe(await store.root)
    const newIndex = newStore.defineIndex('test', () => ({}), jsonEncoding, objectMerge)
    expect(await newIndex.read()).toEqual({ hello: 'world', hola: 'mundo' })
    expect(await newIndex.isDirty()).toBe(true)
  })

  // TODO: This test just covers basic operation, deeper test cases with
  // coverage for various error cases might be a good idea.
})
