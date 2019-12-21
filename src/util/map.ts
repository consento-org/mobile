export function map <In, Out>(iter: Iterator<In>, op: (value: In, index: number) => Out): Out[] {
  const result: Out[] = []
  let index = -1
  while (true) {
    const data = iter.next()
    if (data.done) {
      break
    }
    index += 1
    result.push(op(data.value, index))
  }
  return result
}
