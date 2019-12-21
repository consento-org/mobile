import { ArraySet, ObjectMap } from 'mobx-keystone'
export function first <T>(mapOrSet: ArraySet<T> | ObjectMap<T> | T[]): T {
  if (mapOrSet instanceof ArraySet) {
    return mapOrSet.values().next().value
  }
  if (mapOrSet instanceof ObjectMap) {
    return mapOrSet.values().next().value
  }
  return mapOrSet[0]
}