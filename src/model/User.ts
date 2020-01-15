import { model, Model, prop, arraySet, Ref, findParent, tProp, types, onPatches, modelAction, applySnapshot, getSnapshot, customRef, patchToJsonPatch, JsonPatch } from 'mobx-keystone'
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

type IUserStore = ISecureStore<any>

const cloneJSON = (item: any): any => JSON.parse(JSON.stringify(item))

function displayError (error: Error): void {
  setTimeout(() => {
    console.log('USER ERROR')
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

export const relationRefInUser = customRef<Relation>('consento/Relation#inUser', {
  resolve (ref: Ref<Relation>): Relation {
    return findParentUser(ref)?.findRelation(ref.id)
  }
})

export const vaultRefInUser = customRef<Vault>('consento/Vault#inUser', {
  resolve (ref: Ref<Vault>): Vault {
    return findParentUser(ref)?.findVault(ref.id)
  }
})

function isNotSecretPatch (patch: JsonPatch): boolean {
  return !/^\/vaults\/items\/\d+\/dataSecretBase64\//.test(patch.path)
}

function isNotVaultPatch (patch: JsonPatch): boolean {
  return !/^\/vaults\/items\/\d+\/data(\/|$)/.test(patch.path)
}

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
      const jsonPatches = patches.map(patchToJsonPatch)
        .filter(isNotSecretPatch)
        .filter(isNotVaultPatch)
      if (jsonPatches.length > 0) {
        // TODO: How often should the snapshotter be persisted? Every 20th patch? Every 10 minutes? A combination?
        store.append(jsonPatches).catch(displayError)
      }
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

export function createDefaultUser (): User {
  return new User({ name: 'first-user' })
}
