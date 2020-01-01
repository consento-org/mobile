import { Relation } from './Relation'
import { Vault } from './Vault'
import { RequestBase } from './RequestBase'
import { tProp, types, model, ExtendedModel } from 'mobx-keystone'

@model('consento/ConsentoBecomeLockee')
export class ConsentoBecomeLockee extends ExtendedModel(RequestBase, {
  relation: tProp(types.ref<Relation>()),
  title: tProp(types.string)
}) {
  static KEEP_ALIVE: number = 24 * 60 * 1000
}

@model('consento/ConsentoUnlockVault')
export class ConsentoUnlockVault extends ExtendedModel(RequestBase, {
  relation: tProp(types.ref<Relation>()),
  vault: tProp(types.ref<Vault>())
}) {
  static KEEP_ALIVE: number = 5000
}

export type Consento = typeof ConsentoUnlockVault | typeof ConsentoBecomeLockee
