import { createSecureStore, ISecureStore, IStore, IEncoding } from './createSecureStore'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
import { readAsStringAsync, readDirectoryAsync, writeAsStringAsync, deleteAsync, documentDirectory } from 'expo-file-system'
import { exists } from './exists'
import { Buffer, bufferToString } from '@consento/crypto/util/buffer'
import { ICryptoCore } from '@consento/crypto/core/types'

export const expoStore: IStore = {
  async read (path: string[]): Promise<Uint8Array> {
    const raw = await readAsStringAsync([documentDirectory, ...path].join('/'))
    return Buffer.from(raw, 'base64')
  },
  async write (path: string[], data: Uint8Array): Promise<void> {
    await writeAsStringAsync([documentDirectory, ...path].join('/'), bufferToString(data, 'base64'))
  },
  async delete (path: string[]): Promise<void> {
    await deleteAsync([documentDirectory, ...path].join('/'))
  },
  async list (path: string[]): Promise<string[]> {
    return readDirectoryAsync([documentDirectory, ...path].join('/'))
  }
}

export async function getExpoSecretKey (crypto: ICryptoCore, secretKeyLocation: string): Promise<Uint8Array> {
  const secretKeyRaw = await getItemAsync(secretKeyLocation)
  let secretKey: Uint8Array
  if (exists(secretKeyRaw)) {
    secretKey = Buffer.from(secretKeyRaw, 'base64')
  } else {
    secretKey = await crypto.createSecretKey()
    await setItemAsync(secretKeyLocation, bufferToString(secretKey, 'base64'))
  }
  return secretKey
}

export async function getExpoSecureStore <LogEntry> (crypto: ICryptoCore, secretKeyLocation: string, encoding: IEncoding<LogEntry>): Promise<ISecureStore<LogEntry>> {
  return expoSecureStore(crypto, await getExpoSecretKey(crypto, secretKeyLocation), encoding)
}

export function expoSecureStore <LogEntry> (crypto: ICryptoCore, secretKey: Uint8Array, encoding: IEncoding<LogEntry>): ISecureStore<LogEntry> {
  return createSecureStore(secretKey, {
    crypto,
    store: expoStore,
    encoding
  })
}
