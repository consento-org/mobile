import { getInfoAsync, documentDirectory, makeDirectoryAsync, writeAsStringAsync, readAsStringAsync, deleteAsync, readDirectoryAsync } from 'expo-file-system'
import { bufferToString, toBuffer } from '@consento/crypto/util/buffer'
import { IStore, IStoreEntry } from './createSecureStore'

function toUri (path: string[]): string {
  return [documentDirectory, ...path].join('/')
}

async function _write (path: string[], data: Uint8Array): Promise<void> {
  return writeAsStringAsync(toUri(path), bufferToString(data, 'base64'))
}

async function mkdirp (path: string[]): Promise<void> {
  const pathAsString = toUri(path)
  const info = await getInfoAsync(pathAsString)
  if (!info.exists) {
    await mkdirp(path.slice(0, path.length - 1))
    await makeDirectoryAsync(pathAsString)
  }
}

export const expoStore: IStore = {
  async read (path: string[]): Promise<Uint8Array> {
    const raw = await readAsStringAsync([documentDirectory, ...path].join('/'))
    return toBuffer(raw)
  },
  async info (path: string[]): Promise<IStoreEntry> {
    return getInfoAsync(toUri(path))
  },
  async write (path: string[], data: Uint8Array): Promise<void> {
    try {
      return await _write(path, data)
    } catch (err) {
      await mkdirp(path.slice(0, path.length - 1))
    }
    return _write(path, data)
  },
  async delete (path: string[]): Promise<void> {
    await deleteAsync(toUri(path))
  },
  async list (path: string[]): Promise<string[]> {
    try {
      return await readDirectoryAsync([documentDirectory, ...path].join('/'))
    } catch (err) {
      return []
    }
  }
}
