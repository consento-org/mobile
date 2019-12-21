import { Relation } from './Relation'
import { Vault } from './Vault'
import { RequestBase } from './RequestBase'
import { tProp, types } from 'mobx-keystone'

const BECOME_CONSENTEE_TIMEOUT = 24 * 60 * 1000
const DEFAULT_UNLOCK_TIME = 5000

export const ConsentoBecomeLockee = RequestBase('consento/ConsentoBecomeLockee', BECOME_CONSENTEE_TIMEOUT, {
  relation: tProp(types.ref(types.model(Relation))),
  title: tProp(types.string)
})

export const ConsentoUnlockVault = RequestBase('consento/ConsentoUnlockVault', DEFAULT_UNLOCK_TIME, {
  relation: tProp(types.ref(types.model(Relation))),
  vault: tProp(types.ref(types.model(Vault)))
})

export type Consento = typeof ConsentoUnlockVault | typeof ConsentoBecomeLockee
