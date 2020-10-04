import { model, Model, prop, arraySet, Ref, findParent, tProp, types, modelAction, customRef, JsonPatch, SnapshotOutOf } from 'mobx-keystone'
import { Vault } from './Vault'
import { Relation } from './Relation'
import { IAnyConsento, ConsentoBecomeLockee, ConsentoUnlockVault } from './Consentos'
import { computed, autorun } from 'mobx'
import { find } from '../util/find'
import { contains } from '../util/contains'
import { mobxPersist } from '../util/mobxPersist'
import { VaultLockee } from './VaultData'
import { ISuccessNotification, IAPI } from '@consento/api'
import { ISubscriptionMap, Message, MessageType, IRelationEntry } from './Consento.types'
import { Buffer, exists } from '@consento/api/util'
import { mapSubscriptions } from './mapSubscriptions'

import { combinedDispose } from '../util/combinedDispose'
import { createView, IArrayView } from '../util/ArraySetView'

const ASSUMED_SAFETY_DELAY: number = 1000 // Lets count off a second for network overhead

function initUser (user: User): void {
  ;['My Contracts', 'My Certificates', 'My Passwords'].forEach(name => {
    user.vaults.add(new Vault({ name }))
  })
}

export const findParentUser = (ref: Ref<any>): User | undefined => findParent(ref, n => n instanceof User)

export const relationRefInUser = customRef<Relation>(`${Relation.$modelType as string}#inUser`, {
  resolve (ref: Ref<Relation>) {
    return findParentUser(ref)?.findRelation(ref.id)
  }
})

export const vaultRefInUser = customRef<Vault>(`${Vault.$modelType as string}#inUser`, {
  resolve (ref: Ref<Vault>) {
    return findParentUser(ref)?.findVault(ref.id)
  }
})

export const becomeUnlockeeRefInUser = customRef<ConsentoBecomeLockee>(`${ConsentoBecomeLockee.$modelType as string}#inUser`, {
  resolve (ref: Ref<ConsentoBecomeLockee>) {
    return findParentUser(ref)?.findBecomeLockee(ref.id)
  }
})

function isSecretPatch (patch: JsonPatch): boolean {
  return /^\/vaults\/items\/\d+\/dataSecretBase64\//.test(patch.path)
}

function isVaultPatch (patch: JsonPatch): boolean {
  return /^\/vaults\/items\/\d+\/data(\/|$)/.test(patch.path)
}

export class Lockee implements IRelationEntry, ISortable {
  vaultLockee: VaultLockee
  relation?: Relation

  constructor (vaultLockee: VaultLockee, relation?: Relation) {
    this.relation = relation
    this.vaultLockee = vaultLockee
  }

  get relationId (): string {
    return this.vaultLockee.relationId
  }

  get avatarId (): string | null {
    return this.relation?.avatarId ?? null
  }

  get sortBy (): string {
    return this.relation?.name ?? this.humanId
  }

  get name (): string | null {
    return this.relation?.name ?? null
  }

  get humanId (): string {
    return this.vaultLockee.humanId
  }
}

@model('consento/User')
export class User extends Model({
  name: tProp(types.string),
  loaded: tProp(types.boolean, false),
  vaults: prop(() => arraySet<Vault>()),
  relations: prop(() => arraySet<Relation>()),
  consentos: prop(() => arraySet<IAnyConsento>()),
  lastConsentosView: prop<number | null>(() => null)
}) {
  onAttachedToRootStore (): () => any {
    return combinedDispose(
      autorun(() => {
        for (const consento of this.consentos) {
          if (consento instanceof ConsentoBecomeLockee) {
            if (consento.isCancelled && consento.isHidden) {
              // TODO: this cleanup process for consentos that are deleted works but it its
              //       very had to understand
              this.consentos.delete(consento)
            }
          }
          if (consento instanceof ConsentoUnlockVault) {
            if (consento.deleted) {
              this.consentos.delete(consento)
            }
          }
        }
      }),
      mobxPersist({
        item: this as User,
        location: `consento_user_${this.name}`,
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
    )
  }

  @computed get relationSubscriptions (): ISubscriptionMap {
    return mapSubscriptions(
      this.relations,
      relation => relation.connection.receiver,
      (relation: Relation, notification: ISuccessNotification, api: IAPI): void => {
        // TODO: this belongs to the Relation, probably
        const message: Message = notification.body as any
        if (message.type === MessageType.lockeeRequest) {
          if (message.version !== 1) {
            throw new Error('unknown request version')
          }
          ;(async () => {
            const accept = await api.crypto.acceptHandshake(Buffer.from(message.firstMessageBase64, 'base64'))
            if (contains(this.consentos, consento => consento instanceof ConsentoBecomeLockee && consento.lockId === message.lockId)) {
              return
            }
            this.consentos.add(new ConsentoBecomeLockee({
              relation: relationRefInUser(relation),
              acceptHandshakeJSON: accept.toJSON(),
              lockId: message.lockId,
              shareHex: message.shareHex,
              vaultName: message.vaultName
            }))
          })().catch(error => {
            console.log({ error })
          })
        }
        if (message.type === MessageType.revokeLockee) {
          const consento = this.getConsentoByLockId(message.lockId)
          if (exists(consento)) {
            consento.cancel()
            if (consento.isHidden) {
              this.consentos.delete(consento)
            }
          }
        }
      }
    )
  }

  getConsentoByLockId (lockId: string): ConsentoBecomeLockee | undefined {
    return find(
      this.consentos,
      (consento: IAnyConsento): consento is ConsentoBecomeLockee =>
        consento instanceof ConsentoBecomeLockee &&
        consento.lockId === lockId
    )
  }

  @modelAction recordConsentosView (): void {
    this.lastConsentosView = Date.now()
  }

  @computed get newConsentosCount (): number {
    let count = 0
    const lastConsentosView = this.lastConsentosView
    for (const consento of Array.from(this.consentos.values()).reverse()) {
      if (consento.creationTime < lastConsentosView) {
        break
      }
      count += 1
    }
    return count
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
        if (message.type === MessageType.requestUnlock) {
          if (consento instanceof ConsentoBecomeLockee) {
            const becomeUnlockee = becomeUnlockeeRefInUser(consento.$modelId)
            this.consentos.add(new ConsentoUnlockVault({
              keepAlive: message.keepAlive - ASSUMED_SAFETY_DELAY,
              relation: relationRefInUser(consento.relation.id),
              vaultName: consento.vaultName,
              time: message.time,
              becomeUnlockee
            }))
          }
        }
        if (message.type === MessageType.revokeLockee) {
          if (consento instanceof ConsentoBecomeLockee) {
            consento.cancel()
            if (consento.isHidden) {
              this.consentos.delete(consento)
            }
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
    const userSubscriptions = {
      ...this.relationSubscriptions,
      ...this.vaultSubscriptions,
      ...this.consentoSubscriptions
    }
    return userSubscriptions
  }

  @modelAction _markLoaded (): void {
    if (!this.loaded) {
      this.loaded = true
    }
  }

  getLockees (vault: Vault): IArrayView<Lockee> | undefined {
    const lockees = vault.data?.lockees
    if (lockees === undefined || lockees.size === 0) {
      return
    }
    return createView(lockees, { map: vaultLockee => new Lockee(vaultLockee, this.findRelation(vaultLockee.relationId)) })
  }

  availableRelations (vault: Vault): IArrayView<Relation> {
    return createView(this.relations, {
      filter: relation => !vault.usedRelationIds.has(relation.$modelId)
    })
  }

  findRelation (relationId: string): Relation | undefined {
    return find(this.relations, (relation): relation is Relation => relation.$modelId === relationId)
  }

  findVault (vaultId: string): Vault | undefined {
    return find(this.vaults, (vault): vault is Vault => vault.$modelId === vaultId)
  }

  findBecomeLockee (becomeUnlockeeId: string): ConsentoBecomeLockee | undefined {
    return find(this.consentos, (consento): consento is ConsentoBecomeLockee => consento.$modelId === becomeUnlockeeId)
  }
}

export function createDefaultUser (): User {
  return new User({ name: 'first-user' })
}
