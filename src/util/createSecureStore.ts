import { ICryptoCore } from '@consento/crypto/core/types'
import { bufferToString } from '@consento/crypto/util/buffer'

/**
 * TODO: This secure store belongs into consento/crypto or consento/api
 *
 * This is a secure store implementation for storing the consento business data on a device.
 * It is an append-only-log store with indices that can be merged.
 *
 * The store automatically encrypts each log entry appened.
 *
 * You can access the content only through indices that are able to combine the log entries
 * as they like into an index representation which itself can be persisted (for repeat performance).
 *
 * TODO: While the store is basically working there are several features missing that should be implemented:
 *
 * 1. An auto-purge implementation that drops log entries not necessary if all indices can be restored without the log entries
 *     Note: There is some thinking required to allow to add new indices after a purge that is able to be setup based on other index data
 * 2. A combined log statement that creates "chunks" with a bit bigger sizes ~ 100kb/file to prevent having too many files
 * 3. File systems are not good with many files in a folder. It should split the entries into subfolders once a limit has been reached.
 */
export interface IEncoding <Type> {
  toBuffer: (entry: Type) => Uint8Array
  fromBuffer: (buffer: Uint8Array) => Type
}

export interface IStoreEntry {
  exists: boolean
  isDirectory: boolean
}

export interface IStore {
  read: (path: string[]) => Promise<Uint8Array>
  write: (path: string[], part: Uint8Array) => Promise<void>
  delete: (path: string[]) => Promise<void>
  info: (path: string[]) => Promise<IStoreEntry>
  list: (path: string[]) => Promise<string[]>
}

export interface ISecureStoreOptions <LogEntry> {
  crypto: ICryptoCore
  store: IStore
  encoding: IEncoding<LogEntry>
}

export interface IIndexer <Index> {
  read (): Promise<Index>
  persist (): Promise<void>
  isDirty (): Promise<boolean>
  persistedVersion (): Promise<number>
}

export interface ISecureStore <LogEntry> {
  readonly root: Promise<string>
  version (): Promise<number>
  defineIndex <Index> (name: string, init: () => Index, encoding: IEncoding<Index>, merge: (index: Index, logEntry: LogEntry, version: number) => void): IIndexer<Index>
  append (entry: LogEntry): Promise<void>
  delete (): Promise<void>
}

interface IInternalIndexer <Index, LogEntry> extends IIndexer<Index> {
  update (logEntry: LogEntry): Promise<void>
  delete (): Promise<void>
}

interface IIndexState<Index> {
  version: number
  persistedVersion: number
  data: Index
  dirty: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {}

export function createSecureStore <LogEntry> (secretKey: Uint8Array, options: ISecureStoreOptions<LogEntry>): ISecureStore<LogEntry> {
  const { crypto, store, encoding } = options
  const root = crypto.deriveKdfKey(secretKey).then(key => bufferToString(key, 'hex'))

  const cleanList = async (path: string[]): Promise<number[]> => {
    const fileList = (await store.list([await root, ...path])).filter(entry => /^[0-9]*$/.test(entry))
    return fileList.map(string => parseInt(string, 10))
      .sort((a, b) => {
        if (a > b) return 1
        if (a < b) return -1
        return 0
      })
  }

  let versionLock = (async (): Promise<void> => {
    const states = await cleanList(['data'])
    if (states.length === 0) {
      return
    }
    version = states[states.length - 1] // Just pick the oldest known version
  })()
  versionLock.catch(noop)

  let version = 0
  const lock = async (): Promise<() => void> => {
    let myLock
    while (myLock !== versionLock) {
      // If operations happen before the state is finished
      myLock = versionLock
      await myLock
    }
    let release: () => void
    versionLock = new Promise<void>(resolve => {
      release = resolve
    })
    return release
  }
  const write = async (path: string[], data: Uint8Array): Promise<void> => {
    const encrypted = await crypto.encrypt(secretKey, data)
    await store.write([await root, ...path], encrypted)
  }
  const read = async (path: string[]): Promise<Uint8Array> => {
    const encrypted = await store.read([await root, ...path])
    return crypto.decrypt(secretKey, encrypted) as unknown as Uint8Array
  }
  const indexers: { [name: string]: IInternalIndexer<any, LogEntry> } = {}
  const defineIndex = <Index> (indexName: string, init: () => Index, indexEncoding: IEncoding<Index>, merge: (index: Index, entry: LogEntry, version: number) => any): IIndexer<Index> => {
    if (indexers[indexName] !== undefined) {
      throw new Error(`Indexer ${indexName} already defined.`)
    }
    const processIndex = async (indexVersion: number, data: Index, logVersions: number[]): Promise<IIndexState<Index>> => {
      const persistedVersion = indexVersion
      if (logVersions.length === 0) {
        return {
          dirty: false,
          version: indexVersion,
          persistedVersion,
          data
        }
      }
      for (const logVersion of logVersions) {
        const logEntry = encoding.fromBuffer(await read(['data', logVersion.toString(10)]))
        merge(data, logEntry, indexVersion)
        indexVersion += 1
      }
      return {
        dirty: true,
        version: indexVersion,
        persistedVersion,
        data
      }
    }
    const readIndex = async (indexVersion: number, maxLogVersion: number): Promise<IIndexState<Index>> => {
      const logVersions = (await cleanList(['data']))
        .filter(logVersion => logVersion > indexVersion && logVersion <= maxLogVersion)

      if (logVersions.length !== maxLogVersion - indexVersion) {
        throw new Error('Can not restore index: missing log entries!')
      }

      try {
        const data = indexEncoding.fromBuffer(await read(['index', indexName, indexVersion.toString(10)]))
        return await processIndex(indexVersion, data, logVersions)
      } catch (error) {
        console.log('Invalid index found')
        return null
      }
    }
    let indexLock: Promise<IIndexState<Index>> = (async () => {
      // The version at the creation of the index is taken as latest
      const maxLogVersion = version
      const indexVersions = (await cleanList(['index', indexName])).filter(indexVersion => indexVersion < version)
      while (indexVersions.length > 0) {
        const read = await readIndex(indexVersions.pop(), maxLogVersion)
        if (read !== null) {
          return read
        }
      }
      const data = init()
      if (maxLogVersion === 0) {
        return {
          dirty: false,
          version: 0,
          persistedVersion: 0,
          data
        }
      }
      const logVersions = (await cleanList(['data']))
        .filter(logVersion => logVersion <= maxLogVersion)

      if (logVersions.length !== maxLogVersion) {
        throw new Error(`Can not restore index: missing log entries! ${maxLogVersion.toString()} != ${String(logVersions.length)}`)
      }
      return await processIndex(0, data, logVersions)
    })()
    indexLock.catch(noop)
    const lockIndex = async (): Promise<{ state: IIndexState<Index>, release: (newState: IIndexState<Index>) => void }> => {
      let myLock
      let state: IIndexState<Index>
      while (myLock !== indexLock) {
        myLock = indexLock
        state = await myLock
      }
      let release: (newState) => void
      indexLock = new Promise<IIndexState<Index>>(resolve => {
        release = resolve
      })
      return { state, release }
    }
    const indexer: IInternalIndexer<Index, LogEntry> = {
      async update (entry: LogEntry) {
        const { state, release } = await lockIndex()
        const version = state.version + 1
        try {
          release({
            dirty: true,
            version,
            persistedVersion: state.persistedVersion,
            data: merge(state.data, entry, version)
          })
        } catch (err) {
          console.log(entry)
          throw err
        }
      },
      async persistedVersion () {
        return (await indexLock).persistedVersion
      },
      async isDirty () {
        return (await indexLock).dirty
      },
      async read () {
        return (await indexLock).data
      },
      async persist () {
        const { state, release } = await lockIndex()
        if (!state.dirty) {
          release(state)
          return
        }
        await write(['index', indexName, state.version.toString(10)], indexEncoding.toBuffer(state.data))
        release({
          dirty: false,
          version: state.version,
          persistedVersion: state.version,
          data: state.data
        })
      },
      async delete () {
        const { release } = await lockIndex()
        const persistedVersions = await cleanList(['index', indexName])
        for (const version of persistedVersions) {
          await store.delete(['index', indexName, version.toString(10)])
        }
        release({
          dirty: false,
          version: 0,
          persistedVersion: 0,
          data: init()
        })
      }
    }
    indexers[indexName] = indexer
    return indexer
  }
  const secureStore: ISecureStore<LogEntry> = {
    root,
    async version (): Promise<number> {
      await versionLock
      return version
    },
    defineIndex,
    async append (entry: LogEntry) {
      const release = await lock()
      const newVersion = version + 1
      await write(['data', newVersion.toString(10)], encoding.toBuffer(entry))
      version = newVersion
      release()
      await Promise.all(
        Object.values(indexers).map(async indexer => await indexer.update(entry))
      )
    },
    async delete () {
      const release = await lock()
      await Promise.all(
        Object.values(indexers).map(async indexer => await indexer.delete())
      )
      const entries = await cleanList(['data'])
      // Delete from oldest to newest, this way it is possible to append
      for (const version of entries) {
        await store.delete(['data', version.toString(10)])
      }
      version = 0
      release()
    }
  }
  return secureStore
}
