function _find <In, Out extends In> (iterable: Iterable<In>, match: (input: In) => input is Out): Out | undefined {
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
      return next.value
    }
  }
}

export interface IFind {
  <In, Out extends In> (iterable: Iterable<In>, match: (input: In) => input is Out): Out | undefined
  <In>(iterable: Iterable<In>, match: (input: In) => boolean): In | undefined
}

export const find: IFind = _find
