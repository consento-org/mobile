export function reduce <In, Out> (iter: Iterator<In> | undefined | null, op: (out: Out, value: In, index: number) => Out, initial: Out): Out {
  let result: Out = initial
  if (iter === undefined || iter === null) {
    return result
  }
  let index = -1
  while (true) {
    const data = iter.next()
    if (data.done === true) {
      break
    }
    index += 1
    result = op(result, data.value, index)
  }
  return result
}
