// This file has been generated with expo-export@5.0.0, a Sketch plugin.
export function exists <T> (value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function extract <TObj extends Object, TProp extends keyof TObj> (source: TObj, ...omit: TProp[]): Pick<TObj, TProp> {
  const result: any = {}
  for (const prop of omit) {
    const value = source[prop]
    if (value !== undefined) {
      result[prop] = source[prop]
    }
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete source[prop]
  }
  return result
}
