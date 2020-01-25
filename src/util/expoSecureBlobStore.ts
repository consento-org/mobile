import { sodium } from '@consento/crypto/core/sodium'
import { Buffer, bufferToString, IEncodable, toBuffer } from '@consento/crypto/util/buffer'
import { expoStore } from './expoStore'
import { readAsStringAsync, deleteAsync } from 'expo-file-system'

export async function pathForSecretKey (secretKey: Uint8Array): Promise<string[]> {
  const locationKey = await sodium.deriveKdfKey(secretKey)
  return ['blob', ...bufferToString(locationKey, 'hex').substr(0, 16).split(/(.{4})/).filter(Boolean)]
}

export interface IEncryptedBlob {
  secretKey: Uint8Array
  size?: number
  path: string[]
}

export function isEncryptedBlob (input: any): input is IEncryptedBlob {
  if (typeof input !== 'object' || input === null) {
    return false
  }
  if (!(input.secretKey instanceof Uint8Array)) {
    return false
  }
  const { path } = input
  if (!Array.isArray(path)) {
    return false
  }
  for (const element of path) {
    if (typeof element !== 'string') {
      return false
    }
  }
  return input.size === null || input.size === undefined || typeof input.size === 'number'
}

export async function importFile (fileUri: string, doDelete?: boolean): Promise<IEncryptedBlob> {
  const dataAsString = await readAsStringAsync(fileUri, { encoding: 'base64' })
  if (doDelete) {
    deleteAsync(fileUri)
      .catch(err => {
        console.log(`Warning: Import of ${fileUri} worked, but the original file was not deleted: ${String(err)}`)
      })
  }
  return writeBlob(toBuffer(dataAsString))
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {}
const CACHE: { [path: string]: Promise<IEncodable> } = {}

export async function writeBlob (encodable: IEncodable): Promise<IEncryptedBlob> {
  const secretKey = await sodium.createSecretKey()
  const path = await pathForSecretKey(secretKey)
  const promise = sodium
    .encrypt(secretKey, encodable)
    .then(async encrypted => expoStore.write(path, encrypted))
    .then(() => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete CACHE[path.join('/')]
      return encodable
    })
  CACHE[path.join('/')] = promise
  promise.catch(noop) // To prevent dangling promises
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {
    secretKey,
    path,
    toString: (): string => {
      return `[SecureBlob#${bufferToString(secretKey, 'hex')}@${path.join('/')}]`
    }
  } as IEncryptedBlob
}

async function toBlob (input: string | Uint8Array | IEncryptedBlob): Promise<IEncryptedBlob> {
  if (typeof input === 'string') {
    input = Buffer.from(input, 'hex')
  }
  if (input instanceof Uint8Array) {
    return {
      secretKey: input,
      path: await pathForSecretKey(input)
    }
  }
  return input
}

export async function deleteBlob (input: string | Uint8Array | IEncryptedBlob): Promise<boolean> {
  const { path } = await toBlob(input)
  const info = await expoStore.info(path)
  if (!info.exists) {
    return false
  }
  await expoStore.delete(path)
  return true
}

export async function readBlob (input: string | Uint8Array | IEncryptedBlob): Promise<IEncodable> {
  const { path, secretKey } = await toBlob(input)
  const cached = CACHE[path.join('/')]
  if (cached !== undefined) {
    return cached
  }
  const info = await expoStore.info(path)
  if (!info.exists) {
    throw new Error(`File for key ${bufferToString(secretKey, 'hex')} does not exist!`)
  }
  return sodium.decrypt(secretKey, await expoStore.read(path))
}

export async function readImageBlob (secretKey: Uint8Array | IEncryptedBlob): Promise<string> {
  const data = await readBlob(secretKey)
  let dataBase64: string
  if (typeof data === 'string') {
    if (/^data:/.test(data)) {
      return data
    }
    dataBase64 = data
  } else if (data instanceof Uint8Array) {
    dataBase64 = bufferToString(data, 'base64')
  } else if (typeof data === 'object') {
    throw new Error(`Don't know how to read a JSON image as uri: ${JSON.stringify(data)}`)
  }
  return `data:;base64,${dataBase64}`
}
