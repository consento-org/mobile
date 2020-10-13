export function contains <In> (iterable: Iterable<In>, match: (input: In) => boolean): boolean {
  if (iterable === null || iterable === undefined) {
    return false
  }
  const iterator = iterable[Symbol.iterator]()
  while (true) {
    const next = iterator.next()
    if (next.done === true) {
      return false
    }
    if (match(next.value)) {
      return true
    }
  }
}
