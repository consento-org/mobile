import React from 'react'
import { View, ViewStyle } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { createTabBar } from './components/createTabBar'
import { styles } from '../styles'
import { TNavigation } from './navigation'
import { elementSealVaultActive } from '../styles/component/elementSealVaultActive'
import { elementSealVaultIdle } from '../styles/component/elementSealVaultIdle'
import { elementVaultEmpty } from '../styles/component/elementVaultEmpty'
import { elementLocksEmpty } from '../styles/component/elementLocksEmpty'
import { ConsentoButton } from './components/ConsentoButton'
import { EmptyView } from './components/EmptyView'
import { Logs } from './Logs'
import { Vault as VaultModel } from '../model/Vault'
import { Waiting } from './components/Waiting'
import { withNavigation } from 'react-navigation'

const lockStyle: ViewStyle = {
  height: elementSealVaultActive.height,
  borderBottomColor: elementSealVaultActive.borderBottom.border.fill.color,
  borderBottomWidth: elementSealVaultActive.borderBottom.border.thickness,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {}

const VaultNavigator = createTabBar({
  vaultData: () => <EmptyView prototype={elementVaultEmpty} onAdd={noop} />,
  vaultLocks: () => <EmptyView prototype={elementLocksEmpty} />,
  vaultLog: () => <Logs />
})

function LockButton (props: { onPress?: () => any }): JSX.Element {
  return <View style={lockStyle}>
    <ConsentoButton style={elementSealVaultActive.enabled.place.size()} styleDisabled={elementSealVaultIdle.disabled.place.size()} title='lock' onPress={props.onPress} />
  </View>
}

export const VaultRouter = VaultNavigator.router
export const Vault = withNavigation(({ navigation, vault }: { navigation: TNavigation, vault: VaultModel }): JSX.Element => {
  return <View style={styles.screen}>
    <TopNavigation title={vault.name} back='vaults' onEdit={vault.isOpen ? text => console.log(`changed text: ${text}`) : undefined} onDelete={noop} />
    {
      vault.isOpen ? [
        <LockButton key='lock' />,
        <VaultNavigator key='vault' navigation={navigation} />
      ] : <Waiting />
    }
  </View>
})
