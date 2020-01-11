import { model, Model, prop, arraySet, Ref, findParent } from 'mobx-keystone'
import { Vault } from './Vault'
import { Relation } from './Relation'
import { Consento } from './Consento'
import { computed } from 'mobx'
import { find } from '../util/find'

export const findParentUser = (ref: Ref<any>): User => findParent(ref, n => n instanceof User)

@model('consento/User')
export class User extends Model({
  vaults: prop(() => arraySet<Vault>()),
  relations: prop(() => arraySet<Relation>()),
  consentos: prop(() => arraySet<Consento>())
}) {
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
