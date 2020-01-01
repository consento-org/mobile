import { registerRootStore, ArraySet } from 'mobx-keystone'
import { Connection } from '../model/Connection'
import { first } from '../util/first'
import { VaultRef } from '../model/VaultRef'
import { ConsentoBecomeLockee, ConsentoUnlockVault } from '../model/Consento'
import { RelationRef } from '../model/RelationRef'
import { Vault as VaultModel } from '../model/Vault'
import { User as UserModel, User } from '../model/User'
import { Relation as RelationModel } from '../model/Relation'

export function setupUsers (): ArraySet<User> {
  const users = new ArraySet<User>({ items: [] })
  registerRootStore(users)

  const user = new UserModel({})
  users.add(user)
  ;[
    'Devin',
    'Dan',
    'Dominic',
    'Jackson',
    'James',
    'Joel',
    'John',
    'Jillian',
    'Jimmy',
    'Martin',
    'Maz',
    'Very Very Very Very Very Long Text Interrupted',
    'VeryVeryVeryVeryVeryVeryLongTextUninterrupted',
    '日本語のテキスト、試すために'
  ].forEach((name: string) => {
    user.vaults.add(
      new VaultModel({
        name
      })
    )
  })
  ;['frank'].forEach(name => {
    user.relations.add(new RelationModel({
      name,
      connection: new Connection({
        sendKey: 'abcd',
        receiveKey: 'def'
      })
    }))
  })

  ;[0, 1, 2, 3].forEach(index => {
    const consento = new ConsentoUnlockVault({
      keepAlive: 123,
      vault: VaultRef(first(user.vaults).$modelId),
      relation: RelationRef(first(user.relations).$modelId),
      time: index % 4 === 2 ? 0 : Date.now()
    })
    if (index % 4 === 0) {
      consento.accept()
    } else if (index % 4 === 1) {
      consento.deny()
    }
    user.consentos.add(consento)
  })

  ;['someVault', 'someVault', 'someVault', 'someVault'].forEach((title, index) => {
    const consento = new ConsentoBecomeLockee({
      keepAlive: 200,
      relation: RelationRef(first(user.relations).$modelId),
      title,
      time: index % 4 === 2 ? 0 : undefined
    })
    if (index % 4 === 0) {
      consento.accept()
    } else if (index % 4 === 1) {
      consento.deny()
    }
    user.consentos.add(consento)
  })

  return users
}
