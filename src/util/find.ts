export function find <In, Out extends In> (iterable: Iterable<In>, match: (input: In) => input is Out): Out | undefined {
  const iterator = iterable[Symbol.iterator]()
  while (true) {
    const next = iterator.next()
    if (next.done) {
      return
    }
    if (match(next.value)) {
      return next.value
    }
  }
}
