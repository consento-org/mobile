import { getSnapshot, applySnapshot, onPatches, patchToJsonPatch, BaseModel, JsonPatch, SnapshotOutOf } from 'mobx-keystone'
import { getExpoSecureStore, expoSecureStore } from './expoSecureStore'
import { ISecureStore, IIndexer } from './createSecureStore'
import { jsonEncoding } from './jsonEncoding'
import patcher from 'fast-json-patch'
import { sodium as cryptoCore } from '@consento/crypto/core/sodium'

type IJsonStore = ISecureStore<any>

const cloneJSON = (item: any): any => JSON.parse(JSON.stringify(item))

function displayError (error: Error): void {
  setTimeout(() => {
    console.log('JSON STORE ERROR')
    console.error(error)
  }, 0)
}

interface IBaseData { [key: string]: any }
interface ICreationBaseData { [key: string]: any }

export function mobxPersist <
  TData extends IBaseData,
  TCreationData extends ICreationBaseData,
  TItem extends BaseModel<TData, TCreationData> & { _markLoaded (): void }
> ({ location, secretKey, item, init, filter, clearClone, prepareSnapshot }: {
  location?: string
  item: TItem
  secretKey?: Uint8Array
  init?: (item: TItem) => any
  filter?: (patch: JsonPatch) => boolean
  clearClone: (clone: object) => object
  prepareSnapshot: (item: TItem, snapshot: SnapshotOutOf<TItem>) => SnapshotOutOf<TItem>
}): () => void {
  let store: IJsonStore
  let stopped: boolean = false
  let snapshotLock: boolean = false
  let snapshotter: IIndexer<any>
  ;(async () => {
    const newStore = secretKey !== undefined
      ? expoSecureStore(cryptoCore, secretKey, jsonEncoding)
      : typeof location === 'string'
        ? await getExpoSecureStore(cryptoCore, location, jsonEncoding)
        : null
    if (newStore === null) {
      throw new Error('Neither location nor secret provided!')
    }
    if (stopped) return
    store = newStore
    const version = await store.version()
    if (stopped) return
    const initSnapshot = getSnapshot(item)
    snapshotter = store.defineIndex('snapshot', () => {
      const cloned = cloneJSON(initSnapshot)
      delete cloned.$modelId
      return clearClone(cloned)
    }, jsonEncoding, (snapshot, patches) => {
      if (snapshot === null) {
        return patches
      }
      const { newDocument } = patcher.applyPatch(
        snapshot,
        patches
      )
      return newDocument
    })
    if (version !== 0) {
      const snapshot = await snapshotter.read()
      if (stopped) return
      snapshot.$modelId = item.$modelId
      snapshotLock = true
      applySnapshot(item, prepareSnapshot(item, snapshot))
      snapshotLock = false
    } else {
      if (init !== undefined && item !== null) {
        init(item)
      }
      item._markLoaded()
    }
  })().catch(displayError)
  const stopPatches = onPatches(item, patches => {
    if (stopped) return
    if (snapshotLock) return
    let jsonPatches = patches.map(patchToJsonPatch)
    if (filter !== undefined) {
      jsonPatches = jsonPatches.filter(filter)
    }
    if (jsonPatches.length > 0) {
      store.append(jsonPatches)
        .then(async () => {
          const [persistedVersion, version] = await Promise.all([snapshotter.persistedVersion(), store.version()])
          if ((version - persistedVersion) > 10) {
            await snapshotter.persist()
          }
        })
        .catch(displayError)
    }
  })
  return () => {
    stopped = true
    stopPatches()
  }
}
