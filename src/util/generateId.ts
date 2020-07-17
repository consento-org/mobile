import randomBytes from '@consento/sync-randombytes'
import { bufferToBase32 } from './bufferToBase32'

export function generateId (): string {
  return bufferToBase32(randomBytes(new Uint8Array(6)))
}
