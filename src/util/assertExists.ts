export function assertExists <T> (input: T | null | undefined, error?: string): asserts input is T {
  if (input === null || input === undefined) {
    throw new Error(`Assertion error: ${error ?? '<x> is null | undefined'}`)
  }
}
