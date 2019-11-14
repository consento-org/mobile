import { context } from './util/context'
import { Asset } from './Asset'

export const resources = context({
  icons: {
    navigation: {
      vaults: ({ focused }) => focused ? Asset.iconVaultActive().img() : Asset.iconVaultIdle().img(),
      consentos: ({ focused }) => focused ? Asset.iconConsentoActive().img() : Asset.iconConsentoIdle().img(),
      relations: ({ focused }) => focused ? Asset.iconRelationsActive().img() : Asset.iconRelationsIdle().img()
    }
  },
  strings: {
    navigation: {
      vaults: 'Vaults',
      consentos: 'Consentos',
      relations: 'Relations',
      vaultData: 'Data',
      vaultLocks: 'Locks',
      vaultLog: 'Log'
    }
  }
})
