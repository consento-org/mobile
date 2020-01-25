export function bufferToBase32 (buffer: Uint8Array): string {
  let res: string = ''
  for (const char of buffer) {
    res = `${res}${char.toString(32)}`
  }
  return res
}
