import { sodium } from '@consento/crypto/core/sodium'
import { Buffer, bufferToString, IEncodable, toBuffer } from '@consento/crypto/util/buffer'
import { expoStore } from './expoStore'
import { askAsync, CAMERA_ROLL } from 'expo-permissions'
import * as Sharing from 'expo-sharing'
import { cache } from './expoFsUtils'
import { readAsStringAsync, deleteAsync } from 'expo-file-system/build/FileSystem'
import { Clipboard } from 'react-native'
import { createAssetAsync, createAlbumAsync } from 'expo-media-library'

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

export async function share (data: string | Uint8Array, filename: string): Promise<void> {
  const permission = await askAsync(CAMERA_ROLL)
  if (!permission.granted) {
    return null
  }
  const path = [...await cache.mkdirTmpAsync(), filename]
  await cache.write(path, data)
  await Sharing.shareAsync(cache.resolve(path))
  await cache.delete(path)
}

export async function shareBlob (input: string | Uint8Array | IEncryptedBlob, target: string): Promise<void> {
  const data = await readBlob(input)
  if (typeof data === 'string' || data instanceof Uint8Array) {
    return share(data, target)
  }
  return share(JSON.stringify(data, null, 2), target)
}

export async function copyToClipboard (input: string | Uint8Array, title: string): Promise<boolean> {
  const data = await readBlob(input)
  if (typeof data === 'string') {
    Clipboard.setString(`${title}

${data}`)
    return true
  }
  return false
}

export function safeFileName (fileName: string): string {
  return fileName.replace(/\s\t/ig, '_').replace(/[^a-z0-9_-]/ig, encodeURIComponent).replace(/%20/ig, ' ')
}

export async function exportData (data: string | Uint8Array, albumName: string, fileName: string): Promise<void> {
  const permission = await askAsync(CAMERA_ROLL)
  if (!permission.granted) {
    return null
  }
  const cacheDir = await cache.mkdirTmpAsync()
  const cacheFile = [...cacheDir, fileName]
  await cache.write(cacheFile, data ?? ' ') // If the data is empty an unexpected error is thrown
  const asset = await createAssetAsync(cache.resolve(cacheFile))
  await createAlbumAsync(albumName, asset, false)
  await cache.delete(cacheFile)
}

export async function exportBlob (input: string | Uint8Array | IEncryptedBlob, albumName: string, fileName: string): Promise<void> {
  const data = await readBlob(input)
  if (typeof data === 'string' || data instanceof Uint8Array) {
    return exportData(data, albumName, fileName)
  }
  return exportData(JSON.stringify(data, null, 2), albumName, fileName)
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
    size: -1, // TODO: Improve performance to be able to get an actual size here
    toString: (): string => {
      return `[SecureBlob#${bufferToString(secretKey, 'hex')}@${path.join('/')}]`
    }
  } as IEncryptedBlob
}

async function _toBlob (input: Uint8Array | IEncryptedBlob): Promise<IEncryptedBlob> {
  if (input instanceof Uint8Array) {
    return {
      secretKey: input,
      path: await pathForSecretKey(input)
    }
  }
  return input
}

async function toBlob (input: string | Uint8Array | IEncryptedBlob): Promise<IEncryptedBlob> {
  if (typeof input === 'string') {
    return _toBlob(Buffer.from(input, 'hex'))
  }
  return _toBlob(input)
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
