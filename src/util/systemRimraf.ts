import { expoVaultSecrets } from './expoVaultSecrets'
import { docs, cache } from './expoFsUtils'

export async function systemRimraf (): Promise<void> {
  await Promise.all([
    docs.rimraf(),
    cache.rimraf(),
    expoVaultSecrets.clear()
  ])
}
