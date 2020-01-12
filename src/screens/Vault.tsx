import React, { useContext } from 'react'
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
import { Waiting } from './components/Waiting'
import { withNavigation } from 'react-navigation'
import { observer } from 'mobx-react'
import { VaultContext } from '../model/VaultContext'

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

const VaultData = withNavigation(({ navigation }: { navigation: TNavigation }) => {
  return <EmptyView prototype={elementVaultEmpty} onAdd={() => navigation.navigate('textEditor')} />
})

const VaultNavigator = createTabBar({
  vaultData: () => <VaultData />,
  vaultLocks: () => <EmptyView prototype={elementLocksEmpty} />,
  vaultLog: () => <Logs />
})

function LockButton (props: { onPress?: () => any }): JSX.Element {
  return <View style={lockStyle}>
    <ConsentoButton style={elementSealVaultActive.enabled.place.size()} styleDisabled={elementSealVaultIdle.disabled.place.size()} title='lock' onPress={props.onPress} />
  </View>
}

export const VaultRouter = VaultNavigator.router
export const Vault = withNavigation(observer(({ navigation }: { navigation: TNavigation }): JSX.Element => {
  const { vault } = useContext(VaultContext)
  return <View style={styles.screen}>
    <TopNavigation title={vault.name} back='vaults' onEdit={vault.isOpen ? newName => vault.setName(newName) : undefined} onDelete={noop} />
    {
      vault.isOpen ? [
        <LockButton key='lock' />,
        <VaultNavigator key='vault' navigation={navigation} />
      ] : <Waiting />
    }
  </View>
}))
