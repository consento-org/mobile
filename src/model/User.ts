import { action } from 'mobx'
import { model, Model, prop, tProp, arraySet, Ref, types } from 'mobx-keystone'
import { Vault } from './Vault'
import { Relation } from './Relation'
import { Consento } from './Consento'

@model('consento/User')
export class User extends Model({
  vaults: prop(() => arraySet<Vault>()),
  relations: prop(() => arraySet<Relation>()),
  consentos: prop(() => arraySet<Consento>()),
  test: tProp(types.maybe(types.ref(Relation)))
}) {
  @action
  setTest (rel: Ref<Relation>) {
    this.test = rel
  }
}
