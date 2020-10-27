import { createSecureStore, ISecureStore, IEncoding } from './createSecureStore'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
import { Buffer, bufferToString, exists } from '@consento/api/util'
import { ICryptoCore } from '@consento/crypto/core/types'
import { expoStore as store } from './expoStore'

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
    store,
    encoding
  })
}
