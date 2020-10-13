export function find <In, Out extends In = In> (iterable: Iterable<In> | null | undefined, match: (input: In) => input is Out): Out | undefined {
  if (iterable === null || iterable === undefined) {
    return
  }
  const iterator = iterable[Symbol.iterator]()
  while (true) {
    const next = iterator.next()
    if (next.done === true) {
      return
    }
    if (match(next.value)) {
      return next.value
    }
  }
}

export function assertFind <In, Out extends In = In> (iterable: Iterable<In> | null | undefined, match: (input: In) => input is Out, errorIfMissing: string): Out {
  const result = find(iterable, match)
  if (result === undefined) {
    throw new Error(`[Not found]: ${errorIfMissing}`)
  }
  return result
}
