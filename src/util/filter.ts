export function filter <In, Out extends In> (iterable: Iterable<In>, match: (input: In) => input is Out): Out[] {
  const iterator = iterable[Symbol.iterator]()
  const result: Out[] = []
  while (true) {
    const next = iterator.next()
    if (next.done) {
      break
    }
    if (match(next.value)) {
      result.push(next.value)
    }
  }
  return result
}
