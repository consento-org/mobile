import { Buffer, bufferToString } from '@consento/crypto/util/buffer'

const flag = new Uint8Array(1)
export const jsonEncoding = {
  toBuffer (input: any): Uint8Array {
    return Buffer.concat([flag, Buffer.from(JSON.stringify(input))])
  },
  fromBuffer (buffer: Uint8Array): any {
    const str = bufferToString(buffer.slice(1))
    try {
      return JSON.parse(str)
    } catch (err) {
      throw new Error(`${err}: \n ${str}`)
    }
  }
}
