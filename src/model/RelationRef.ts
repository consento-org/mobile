import { customRef, findParent } from 'mobx-keystone'
import { Relation, MODEL } from './Relation'
import { User } from './User'
import { Ref } from 'react'
import { find } from '../util/find'

export function findRelation (user: User, id: string): Relation {
  return find(user.relations, (relation): relation is Relation => relation.$modelId === id)
}

const getRef = customRef<Relation>(MODEL, {
  resolve (ref) {
    const user = findParent<User>(ref, n => n instanceof User)
    if (user === undefined) {
      return
    }
    return findRelation(user, ref.id)
  }
})

export function RelationRef (id: string): Ref<Relation> {
  return getRef(id)
}
