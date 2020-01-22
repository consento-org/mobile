import { model, Model, prop, arraySet, Ref, findParent, tProp, types, modelAction, customRef, JsonPatch, SnapshotOutOf } from 'mobx-keystone'
import { Vault } from './Vault'
import { Relation } from './Relation'
import { IAnyConsento, ConsentoBecomeLockee } from './Consentos'
import { computed } from 'mobx'
import { find } from '../util/find'
import { mobxPersist } from '../util/mobxPersist'
import { compareNames } from '../util/compareNames'
import { VaultLockee } from './VaultData'
import { ISuccessNotification, IAPI } from '@consento/api'
import { ISubscriptionMap, Message, MessageType } from './Consento.types'
import { Buffer } from 'buffer'
import { mapSubscriptions } from './mapSubscriptions'

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
  consentos: prop(() => arraySet<IAnyConsento>())
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

  @computed get relationSubscriptions (): ISubscriptionMap {
    return mapSubscriptions(
      this.relations,
      relation => relation.connection.receiver,
      (relation: Relation, notification: ISuccessNotification, api: IAPI): void => {
        const message: Message = notification.body as any
        if (message.type === MessageType.lockeeRequest) {
          if (message.version !== 1) {
            throw new Error('unknown request version')
          }
          ;(async () => {
            const accept = await api.crypto.acceptHandshake(Buffer.from(message.firstMessageBase64, 'base64'))
            this.consentos.add(new ConsentoBecomeLockee({
              relation: relationRefInUser(relation),
              acceptHandshakeJSON: accept.toJSON(),
              pendingLockId: message.pendingLockId,
              shareHex: message.shareHex,
              vaultName: message.vaultName
            }))
          })().catch(error => {
            console.log({ error })
          })
          return
        }
        if (message.type === MessageType.unlock) {
          console.log('unlock')
        }
      }
    )
  }

  @computed get consentoSubscriptions (): ISubscriptionMap {
    return mapSubscriptions(
      this.consentos,
      consento => consento.receiver, // consento's without a receiver will be ignored!
      (consento: IAnyConsento, notification: ISuccessNotification, api: IAPI): void => {
        const message: Message = notification.body as any
        if (message.type === MessageType.finalizeLockee) {
          if (consento instanceof ConsentoBecomeLockee) {
            consento.finalize(api, message.finalMessageBase64)
          }
        }
      }
    )
  }

  @computed get vaultSubscriptions (): ISubscriptionMap {
    let map: ISubscriptionMap = {}
    for (const vault of this.vaults) {
      map = {
        ...map,
        ...vault.subscriptions
      }
    }
    return map
  }

  @computed get subscriptions (): ISubscriptionMap {
    return {
      ...this.relationSubscriptions,
      ...this.vaultSubscriptions,
      ...this.consentoSubscriptions
    }
  }

  @modelAction _markLoaded (): void {
    if (this.loaded === false) {
      this.loaded = true
    }
  }

  getLockeesSorted (vault: Vault): Lockee[] {
    return vault.data?.lockees.items.map(
      vaultLockee => new Lockee(vaultLockee, this.findRelation(vaultLockee.relationId))
    ).sort(compareNames)
  }

  @computed get relationsSorted (): Relation[] {
    return Array.from(this.relations.values()).sort(compareNames)
  }

  availableRelations (vault: Vault): Relation[] {
    const usedRelations = vault.data?.lockees.items.reduce((map: { [key: string]: true }, vaultLockee) => {
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
