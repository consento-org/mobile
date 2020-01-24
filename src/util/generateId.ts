import { bufferToString, Buffer } from '@consento/crypto/util/buffer'
import randomBytes from '@consento/sync-randombytes'

export function generateId (): string {
  return bufferToString(randomBytes(Buffer.alloc(16)), 'hex')
}
