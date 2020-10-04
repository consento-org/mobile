function _find <In, Out extends In> (iterable: Iterable<In> | null | undefined, match: (input: In) => input is Out): Out | undefined {
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

export interface IFind {
  <In, Out extends In> (iterable: Iterable<In> | null | undefined, match: (input: In) => input is Out): Out | undefined
  <In>(iterable: Iterable<In> | null | undefined, match: (input: In) => boolean): In | undefined
}

export const find: IFind = _find
