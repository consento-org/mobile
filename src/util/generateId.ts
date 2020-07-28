import randomBytes from 'get-random-values-polypony'
import { bufferToBase32 } from './bufferToBase32'

export function generateId (): string {
  return bufferToBase32(randomBytes(new Uint8Array(6)))
}
