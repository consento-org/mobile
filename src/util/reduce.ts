export function reduce <In, Out> (iter: Iterator<In>, op: (out: Out, value: In, index: number) => Out, initial: Out): Out {
  let result: Out = initial
  let index = -1
  while (true) {
    const data = iter.next()
    if (data.done) {
      break
    }
    index += 1
    result = op(result, data.value, index)
  }
  return result
}
