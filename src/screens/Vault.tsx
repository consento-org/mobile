import React, { useContext } from 'react'
import { View, ViewStyle, Alert } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { createTabBar } from './components/createTabBar'
import { styles } from '../styles'
import { TNavigation } from './navigation'
import { elementSealVaultActive } from '../styles/component/elementSealVaultActive'
import { elementSealVaultIdle } from '../styles/component/elementSealVaultIdle'
import { elementLocksEmpty } from '../styles/component/elementLocksEmpty'
import { ConsentoButton } from './components/ConsentoButton'
import { EmptyView } from './components/EmptyView'
import { Logs } from './Logs'
import { Waiting } from './components/Waiting'
import { withNavigation } from 'react-navigation'
import { observer } from 'mobx-react'
import { VaultContext } from '../model/VaultContext'
import { PopupMenu } from './components/PopupMenu'
import { FileList } from './components/FileList'
import { User } from '../model/User'
import { Vault as VaultModel } from '../model/Vault'
import { ConsentoContext } from '../model/ConsentoContext'

const lockStyle: ViewStyle = {
  height: elementSealVaultActive.height,
  borderBottomColor: elementSealVaultActive.borderBottom.border.fill.color,
  borderBottomWidth: elementSealVaultActive.borderBottom.border.thickness,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

function confirmDelete (user: User, vault: VaultModel, navigation: TNavigation): void {
  Alert.alert(
    'Delete',
    'Are you sure you want to delete this Vault? This can not be reverted!',
    [
      {
        text: 'Delete',
        onPress: () => {
          user.vaults.delete(vault)
          navigation.navigate('vaults')
        }
      },
      { text: 'Cancel' }
    ]
  )
}

const VaultData = withNavigation(({ navigation }: { navigation: TNavigation }): JSX.Element => {
  return <FileList />
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
  const { user } = useContext(ConsentoContext)
  const { vault } = useContext(VaultContext)
  return <PopupMenu>
    <View style={{ ...styles.screen, position: 'absolute', width: '100%', height: '100%' }}>
      <TopNavigation title={vault.name} back='vaults' onEdit={vault.isOpen ? newName => vault.setName(newName) : undefined} onDelete={() => confirmDelete(user, vault, navigation)} />
      {
        vault.isOpen ? [
          <LockButton key='lock' />,
          <VaultNavigator key='vault' navigation={navigation} />
        ] : <Waiting />
      }
    </View>
  </PopupMenu>
}))
