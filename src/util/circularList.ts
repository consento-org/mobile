export interface IListNode <T> {
  node: T
  next: IListNode<T>
}

export function createCircularList <T> (entries: T[]): IListNode<T> | null {
  if (entries.length === 0) {
    return null
  }
  const first: Partial<IListNode<T>> = { node: entries[0] }
  let last = first
  for (let i = 1; i < entries.length; i++) {
    const current: Partial<IListNode<T>> = { node: entries[i] }
    last.next = current as IListNode<T>
    last = current
  }
  last.next = first as IListNode<T>
  return first as IListNode<T>
}
