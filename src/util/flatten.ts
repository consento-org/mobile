
interface Flat<T> { [ key: string]: T }
type Node<T> = T | Hierarchy<T>
export interface Hierarchy<T> { [key: string]: Node<T> }

export function flatten<T> (isT: (arg: Node<T>) => arg is T, hierarchy: Hierarchy<T>, target: Flat<T> = {}, prefix: string = ''): Flat<T> {
  for (const key in hierarchy) {
    const value = hierarchy[key]
    if (!isT(value)) {
      return flatten(isT, value, target, `${prefix}${key}.`)
    }
    target[`${prefix}${key}`] = value
  }
  return target
}
