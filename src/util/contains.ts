export function contains <In> (iterable: Iterable<In>, match: (input: In) => boolean): boolean {
  if (iterable === null || iterable === undefined) {
    return
  }
  const iterator = iterable[Symbol.iterator]()
  while (true) {
    const next = iterator.next()
    if (next.done) {
      return
    }
    if (match(next.value)) {
      return true
    }
  }
  return false
}
