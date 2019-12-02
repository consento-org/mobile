import React from 'react'
import { View, ViewStyle } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { createTabBar } from './components/createTabBar'
import { styles } from '../styles'
import { withNavigation, TNavigation } from './navigation'
import { elementSealVaultActive } from '../styles/component/elementSealVaultActive'
import { elementSealVaultIdle } from '../styles/component/elementSealVaultIdle'
import { elementVaultEmpty } from '../styles/component/elementVaultEmpty'
import { elementLocksEmpty } from '../styles/component/elementLocksEmpty'
import { ConsentoButton } from './components/ConsentoButton'
import { EmptyView } from './components/EmptyView'
import { Logs } from './Logs'
import { TVaultState, IVault } from '../model/Vault'
import { Waiting } from './components/Waiting'

const lockStyle: ViewStyle = {
  height: elementSealVaultActive.height,
  borderBottomColor: elementSealVaultActive.borderBottom.border.fill.color,
  borderBottomWidth: elementSealVaultActive.borderBottom.border.thickness,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const VaultNavigator = createTabBar({
  vaultData: () => <EmptyView prototype={ elementVaultEmpty } onAdd={ () => {} }/>,
  vaultLocks: () => <EmptyView prototype={ elementLocksEmpty }/>,
  vaultLog: () => <Logs/>
})

function LockButton (props: { onPress?: () => any }) {
  return <View style={ lockStyle }>
    <ConsentoButton style={ elementSealVaultActive.enabled.place.size() } styleDisabled={ elementSealVaultIdle.disabled.place.size() } title={ 'lock' } onPress={ props.onPress }/>
  </View>
}
export const VaultRouter = VaultNavigator.router
export const Vault = ({ navigation, vault }:　{ navigation: TNavigation, vault: IVault }) => {
  const isOpen = vault.state === TVaultState.open
  return <View style={ styles.screen }>
    <TopNavigation title={ vault.name } back={ true } onEdit={ isOpen ? text => console.log(`changed text: ${text}`) : undefined } onDelete={ () => {} }/>
    {
      isOpen ? [
        <LockButton key={ 'lock' }/>,
        <VaultNavigator key={ 'vault' } navigation={ navigation }></VaultNavigator>
      ] : <Waiting />
    }
  </View>
}
