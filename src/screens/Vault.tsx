import React, { useContext, useEffect } from 'react'
import { View, ViewStyle, Image } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { createTabBar } from './components/createTabBar'
import { TNavigation } from './navigation'
import { elementSealVaultActive } from '../styles/component/elementSealVaultActive'
import { elementSealVaultIdle } from '../styles/component/elementSealVaultIdle'
import { elementVaultsLoading } from '../styles/component/elementVaultsLoading'
import { ConsentoButton } from './components/ConsentoButton'
import { Logs } from './Logs'
import { Waiting } from './components/Waiting'
import { withNavigation } from 'react-navigation'
import { observer } from 'mobx-react'
import { VaultContext } from '../model/VaultContext'
import { PopupMenu } from './components/PopupMenu'
import { FileList } from './components/FileList'
import { Locks } from './components/Locks'
import { ConsentoContext } from '../model/Consento'
import { ScreenshotContext } from '../util/screenshots'
import { deleteWarning } from './components/deleteWarning'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const animation = require('../../assets/animation/consento_symbol_animation.gif')

const lockStyle: ViewStyle = {
  height: elementSealVaultActive.height,
  backgroundColor: elementSealVaultActive.backgroundColor,
  borderBottomColor: elementSealVaultActive.borderBottom.border.fill.color,
  borderBottomWidth: elementSealVaultActive.borderBottom.border.thickness,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const VaultNavigator = createTabBar({
  vaultData: {
    label: 'Files',
    screen: () => <FileList />
  },
  vaultLocks: {
    label: 'Locks',
    screen: () => <Locks />
  },
  vaultLog: {
    label: 'Logs',
    screen: () => <Logs />
  }
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
  const screenshots = useContext(ScreenshotContext)
  useEffect(() => {
    if (!vault.isOpen && !vault.isLoading) {
      vault.requestUnlock()
    }
  }, [vault.isLoading])
  useEffect(() => {
    if (!vault.isOpen && !vault.isPending && !vault.isLoading) {
      navigation.navigate('vaults')
    }
  }, [vault.isPending, vault.isLoading])
  const handleNameEdit = vault.isOpen ? newName => vault.setName(newName) : undefined
  const handleDelete = (): void => {
    deleteWarning({
      onPress (): void {
        user.vaults.delete(vault)
        navigation.navigate('vaults')
      },
      itemName: 'Vault'
    })
  }
  const handleLock = vault.isClosable ? () => {
    navigation.navigate('vaults')
    vault.lock()
      .catch(lockError => console.error(lockError))
  } : undefined
  if (!vault.isOpen && !vault.isLoading) {
    screenshots.vaultPending.takeSync(1000)
  }
  return <PopupMenu>
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <TopNavigation title={vault.name} titlePlaceholder={vault.humanId} back='vaults' onEdit={handleNameEdit} onDelete={handleDelete} />
      {
        vault.isOpen
          ? [
            <LockButton key='lock' onPress={handleLock} />,
            <VaultNavigator key='vault' navigation={navigation} />
          ]
          : vault.isLoading
            ? <View style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={animation} style={elementVaultsLoading.placeholder.place.size({})} />
              {elementVaultsLoading.loadingData.render({})}
            </View>
            : <Waiting vault={vault} />
      }
    </View>
  </PopupMenu>
}))
