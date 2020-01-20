import { model, Model, prop, arraySet, Ref, findParent, tProp, types, modelAction, customRef, JsonPatch, SnapshotOutOf } from 'mobx-keystone'
import { Vault } from './Vault'
import { Relation } from './Relation'
import { Consentos } from './Consentos'
import { computed } from 'mobx'
import { find } from '../util/find'
import { mobxPersist } from '../util/mobxPersist'
import { compareNames } from '../util/compareNames'
import { VaultLockee } from './VaultData'

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

function isSecretPatch (patch: JsonPatch): boolean {
  return /^\/vaults\/items\/\d+\/dataSecretBase64\//.test(patch.path)
}

function isVaultPatch (patch: JsonPatch): boolean {
  return /^\/vaults\/items\/\d+\/data(\/|$)/.test(patch.path)
}

export class Lockee {
  vaultLockee: VaultLockee
  relation?: Relation

  constructor (vaultLockee: VaultLockee, relation?: Relation) {
    this.relation = relation
    this.vaultLockee = vaultLockee
  }

  get displayName (): string {
    return this.relation?.displayName
  }

  get $modelId (): string {
    return this.vaultLockee.$modelId
  }
}

@model('consento/User')
export class User extends Model({
  name: tProp(types.string),
  loaded: tProp(types.boolean, false),
  vaults: prop(() => arraySet<Vault>()),
  relations: prop(() => arraySet<Relation>()),
  consentos: prop(() => arraySet<Consentos>())
}) {
  onAttachedToRootStore (): () => any {
    return mobxPersist({
      item: this,
      location: `user_${this.name}`,
      filter: (patch: JsonPatch) => !isVaultPatch(patch) && !isSecretPatch(patch),
      init: initUser,
      clearClone: (cloned: any) => {
        delete cloned.relations.$modelId
        delete cloned.consentos.$modelId
        delete cloned.vaults.$modelId
        return cloned
      },
      prepareSnapshot: (item: User, snapshot: SnapshotOutOf<User>) => {
        snapshot.relations.$modelId = item.relations.$modelId
        snapshot.consentos.$modelId = item.consentos.$modelId
        snapshot.vaults.$modelId = this.vaults.$modelId
        return snapshot
      }
    })
  }

  @modelAction _markLoaded (): void {
    if (this.loaded === false) {
      this.loaded = true
    }
  }

  getLockeesSorted (vault: Vault): Lockee[] {
    return vault.data?.lockees.map(
      vaultLockee => new Lockee(vaultLockee, this.findRelation(vaultLockee.relationId))).sort(compareNames
    )
  }

  @computed get relationsSorted (): Relation[] {
    return Array.from(this.relations.values()).sort(compareNames)
  }

  availableRelations (vault: Vault): Relation[] {
    const usedRelations = vault.data?.lockees.reduce((map: { [key: string]: true }, vaultLockee) => {
      map[vaultLockee.relationId] = true
      return map
    }, {})
    return this.relationsSorted.filter(relation => usedRelations[relation.$modelId] === undefined)
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
