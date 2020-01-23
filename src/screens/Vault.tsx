import React, { useContext, useEffect } from 'react'
import { View, ViewStyle, Alert } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { createTabBar } from './components/createTabBar'
import { TNavigation } from './navigation'
import { elementSealVaultActive } from '../styles/component/elementSealVaultActive'
import { elementSealVaultIdle } from '../styles/component/elementSealVaultIdle'
import { ConsentoButton } from './components/ConsentoButton'
import { Logs } from './Logs'
import { Waiting } from './components/Waiting'
import { withNavigation } from 'react-navigation'
import { observer } from 'mobx-react'
import { VaultContext } from '../model/VaultContext'
import { PopupMenu } from './components/PopupMenu'
import { FileList } from './components/FileList'
import { User } from '../model/User'
import { Vault as VaultModel } from '../model/Vault'
import { Locks } from './components/Locks'
import { ConsentoContext } from '../model/Consento'

const lockStyle: ViewStyle = {
  height: elementSealVaultActive.height,
  backgroundColor: elementSealVaultActive.backgroundColor,
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

const VaultNavigator = createTabBar({
  vaultData: () => <FileList />,
  vaultLocks: () => <Locks />,
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
  useEffect(() => {
    if (!vault.isOpen && !vault.isLoading) {
      vault.requestUnlock()
    }
  }, [vault.isLoading])
  const handleNameEdit = vault.isOpen ? newName => vault.setName(newName) : undefined
  const handleDelete = (): void => confirmDelete(user, vault, navigation)
  const handleLock = vault.isClosable ? () => {
    navigation.navigate('vaults')
    vault.lock()
      .catch(lockError => console.error(lockError))
  } : undefined
  return <PopupMenu>
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <TopNavigation title={vault.name} titlePlaceholder={vault.defaultName} back='vaults' onEdit={handleNameEdit} onDelete={handleDelete} />
      {
        vault.isOpen ? [
          <LockButton key='lock' onPress={handleLock} />,
          <VaultNavigator key='vault' navigation={navigation} />
        ] : <Waiting vault={vault} />
      }
    </View>
  </PopupMenu>
}))
