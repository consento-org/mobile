export function last <T> (input: T[]): T | undefined {
  if (input.length === 0) {
    return
  }
  return input[input.length - 1]
}
