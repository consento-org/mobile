import { model, Model, prop, arraySet, Ref, findParent, tProp, types, modelAction, customRef, JsonPatch, SnapshotOutOf } from 'mobx-keystone'
import { Vault } from './Vault'
import { Relation } from './Relation'
import { Consento } from './Consento'
import { computed } from 'mobx'
import { find } from '../util/find'
import { mobxPersist } from '../util/mobxPersist'
import { IConsentoCrypto } from '@consento/api'
import { Lockee } from './VaultData'

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

@model('consento/User')
export class User extends Model({
  name: tProp(types.string),
  loaded: tProp(types.boolean, false),
  vaults: prop(() => arraySet<Vault>()),
  relations: prop(() => arraySet<Relation>()),
  consentos: prop(() => arraySet<Consento>())
}) {
  static async create (crypto: IConsentoCrypto, relation: Relation): Promise<Lockee> {
    const handshake = await crypto.initHandshake()
    const lockee = new Lockee({
      relationRef: relationRefInUser(relation.$modelId),
      initJSON: handshake.toJSON(),
      confirmJSON: null
    })
    return lockee
  }

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
