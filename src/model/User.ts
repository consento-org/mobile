import { model, Model, prop, arraySet } from 'mobx-keystone'
import { Vault } from './Vault'
import { Relation } from './Relation'
import { Consento } from './Consento'
import { computed } from 'mobx'

@model('consento/User')
export class User extends Model({
  vaults: prop(() => arraySet<Vault>()),
  relations: prop(() => arraySet<Relation>()),
  consentos: prop(() => arraySet<Consento>())
}) {
  @computed get relationsSorted (): Relation[] {
    return Array.from(this.relations.values()).sort((a, b): number => a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase(), 'en-co-phonebk'))
  }
}
