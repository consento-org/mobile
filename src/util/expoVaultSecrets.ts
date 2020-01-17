import { createVaultSecrets } from './createVaultSecrets'
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store'
import { cryptoCore } from '../cryptoCore'

export const expoVaultSecrets = createVaultSecrets({
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
  cryptoCore
})
