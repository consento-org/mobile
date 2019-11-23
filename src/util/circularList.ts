export interface IListNode <T> {
  node: T
  next: IListNode<T>
}

export function createCircularList <T> (entries: T[]): IListNode<T> {
  if (entries.length === 0) {
    return null
  }
  const first: IListNode<T> = { node: entries[0], next: null }
  let last = first
  for (let i = 1; i < entries.length; i++) {
    const current: IListNode<T> = { node: entries[i], next: null }
    last.next = current
    last = current
  }
  last.next = first
  return first
}
