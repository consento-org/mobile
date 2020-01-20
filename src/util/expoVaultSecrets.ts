import { createVaultSecrets } from './createVaultSecrets'
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store'
import { cryptoCore } from '../cryptoCore'
import { Model, ObjectMap, objectMap, prop, model, modelAction } from 'mobx-keystone'

const vaultSecrets = createVaultSecrets({
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
  cryptoCore
})

@model('consento/ExpoVaultSecrets')
export class ExpoVaultSecrets extends Model({
  secretsBase64: prop<ObjectMap<string>>(() => objectMap())
}) {
  @modelAction async clear (): Promise<void> {
    this.secretsBase64.clear()
    return vaultSecrets.clear()
  }

  createDataKeyHex (): string {
    const created = vaultSecrets.create()
    ;(async () => {
      this.secretsBase64.set(created.keyHex, await created.secretKeyBase64)
    })().catch(createError => console.log({ createError }))
    return created.keyHex
  }

  onInit (): void {
    (async () => {
      const persistedKeysHex = await vaultSecrets.persistedKeys()
      await Promise.all(persistedKeysHex.map(async (keyHex) => {
        this.secretsBase64.set(keyHex, await vaultSecrets.get(keyHex))
      }))
    })().catch(vaultInitError => console.error({ vaultInitError }))
  }

  async persist (keyHex: string, secretBase64: string): Promise<void> {
    await this.unlock(keyHex, secretBase64, true)
  }

  async toggleDevicePersistence (keyHex: string, persistOnDevice: boolean): Promise<void> {
    await vaultSecrets.toggleDevicePersistence(keyHex, persistOnDevice)
  }

  async unlock (keyHex: string, secretBase64: string, persistOnDevice: boolean): Promise<void> {
    this._update(keyHex, secretBase64)
    await vaultSecrets.set(keyHex, secretBase64, persistOnDevice)
  }

  @modelAction _update (keyHex: string, secretBase64: string): void {
    this.secretsBase64.set(keyHex, secretBase64)
  }
}

export const expoVaultSecrets = new ExpoVaultSecrets({})
