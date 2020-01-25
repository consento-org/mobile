import { Buffer } from '@consento/crypto/util/buffer'
import randomBytes from '@consento/sync-randombytes'
import { bufferToBase32 } from './bufferToBase32'

export function generateId (): string {
  return bufferToBase32(randomBytes(Buffer.alloc(6)))
}
