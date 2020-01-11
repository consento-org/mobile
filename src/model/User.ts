import { model, Model, prop, arraySet, Ref, findParent, tProp, types, onPatches, Patch, modelAction, applySnapshot, getSnapshot } from 'mobx-keystone'
import { Vault } from './Vault'
import { Relation } from './Relation'
import { Consento } from './Consento'
import { computed } from 'mobx'
import { ISecureStore } from '../util/createSecureStore'
import { getExpoSecureStore } from '../util/expoSecureStore'
import { cryptoCore } from '../cryptoCore'
import { Buffer, bufferToString } from '@consento/crypto/util/buffer'
import patcher from 'fast-json-patch'
import { find } from '../util/find'

interface IJSONPatch {
  op: 'replace' | 'remove' | 'add'
  path: string
  value?: any
}

type IUserStore = ISecureStore<any>

const cloneJSON = (item: any): any => JSON.parse(JSON.stringify(item))

const patchToJSONPatch = (patch: Patch): IJSONPatch => {
  return {
    op: patch.op,
    path: '/' + patch.path.join('/'),
    value: patch.value
  }
}

function displayError (error: Error): void {
  setTimeout(() => {
    console.error(error)
  }, 0)
}

const flag = new Uint8Array(1)
const jsonEncoding = {
  toBuffer (input: any): Uint8Array {
    return Buffer.concat([flag, Buffer.from(JSON.stringify(input))])
  },
  fromBuffer (buffer: Uint8Array): any {
    const str = bufferToString(buffer.slice(1))
    try {
      return JSON.parse(str)
    } catch (err) {
      throw new Error(`${err}: \n ${str}`)
    }
  }
}

function initUser (user: User): void {
  ;['My Contracts', 'My Certificates', 'My Passwords'].forEach(name => {
    user.vaults.add(new Vault({ name }))
  })
}

export const findParentUser = (ref: Ref<any>): User => findParent(ref, n => n instanceof User)

@model('consento/User')
export class User extends Model({
  name: tProp(types.string),
  loaded: tProp(types.boolean, false),
  vaults: prop(() => arraySet<Vault>()),
  relations: prop(() => arraySet<Relation>()),
  consentos: prop(() => arraySet<Consento>())
}) {
  onAttachedToRootStore (): () => any {
    let store: IUserStore
    let stopped: boolean = false
    let snapshotLock: boolean = false
    getExpoSecureStore(cryptoCore, `user_${this.name}`, jsonEncoding)
      .then(async (newStore): Promise<void> => {
        if (stopped) return
        store = newStore
        const version = await store.version()
        if (stopped) return
        const initSnapshot = getSnapshot(this)
        const snapshotter = store.defineIndex('snapshot', () => {
          const cloned = cloneJSON(initSnapshot)
          delete cloned.$modelId
          delete cloned.relations.$modelId
          delete cloned.consentos.$modelId
          delete cloned.vaults.$modelId
          return cloned
        }, jsonEncoding, (snapshot, patches) => {
          if (snapshot === null) {
            return patches
          }
          console.log({ patches })
          const { newDocument } = patcher.applyPatch(
            snapshot,
            patches
          )
          return newDocument
        })
        if (version !== 0) {
          const snapshot = await snapshotter.read()
          if (stopped) return
          // Don't replace the instance or the instances relations/consentos/vaults
          snapshot.$modelId = this.$modelId
          snapshot.relations.$modelId = this.relations.$modelId
          snapshot.consentos.$modelId = this.consentos.$modelId
          snapshot.vaults.$modelId = this.vaults.$modelId
          snapshotLock = true
          console.log({
            snapshot,
            testShot: getSnapshot(this)
          })
          applySnapshot(this, snapshot)
          snapshotLock = false
        } else {
          initUser(this)
          this._markLoaded()
        }
      })
      .catch(displayError)
    const stopPatches = onPatches(this, patches => {
      if (stopped) return
      if (snapshotLock) return
      // TODO: How often shoult the snapshotter be persisted? Every 20th patch? Every 10 minutes?
      store.append(patches.map(patchToJSONPatch)).catch(displayError)
    })
    return () => {
      stopped = true
      stopPatches()
    }
  }

  @modelAction _markLoaded (): void {
    if (this.loaded === false) {
      this.loaded = true
    }
  }

  @computed get relationsSorted (): Relation[] {
    return Array.from(this.relations.values()).sort((a, b): number => a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase(), 'en-co-phonebk'))
  }

  findRelation (relationId: string): Relation {
    return find(this.relations, (relation): relation is Relation => relation.$modelId === relationId)
  }

  findVault (vaultId: string): Vault {
    return find(this.vaults, (vault): vault is Vault => vault.$modelId === vaultId)
  }
}
