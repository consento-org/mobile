import { customRef, findParent, Ref } from 'mobx-keystone'
import { Vault, MODEL } from './Vault'
import { User } from './User'
import { find } from '../util/find'

export function findVault (user: User, id: string): Vault {
  return find(user.vaults, (vault): vault is Vault => vault.$modelId === id)
}

const getRef = customRef<Vault>(MODEL, {
  resolve (ref) {
    const user = findParent<User>(ref, n => n instanceof User)
    if (user === undefined) {
      return
    }
    return findVault(user, ref.id)
  }
})

export function VaultRef (id: string): Ref<Vault> {
  return getRef(id)
}
