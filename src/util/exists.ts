// TODO: Deprecate and use new ?. and ?? syntax from typescript 3.7
export function exists <T> (value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function anyExists (...items: any[]): boolean {
  for (const item of items) {
    if (item !== null && item !== undefined) {
      return true
    }
  }
  return false
}
