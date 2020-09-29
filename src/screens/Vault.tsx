import React, { useContext, useEffect } from 'react'
import { View, ViewStyle, Image } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { ConsentoButton } from './components/ConsentoButton'
import { createTabBar } from './components/createTabBar'
import { Logs } from './Logs'
import { Waiting } from './components/Waiting'
import { observer } from 'mobx-react'
import { VaultContext } from '../model/VaultContext'
import { PopupMenu } from './components/PopupMenu'
import { FileList } from './components/FileList'
import { Locks } from './components/Locks'
import { ConsentoContext } from '../model/Consento'
import { ScreenshotContext } from '../util/screenshots'
import { deleteWarning } from './components/deleteWarning'
import { elementSealVaultActive } from '../styles/design/layer/elementSealVaultActive'
import { ViewBorders } from '../styles/util/types'
import { navigate } from '../util/navigate'
import { elementVaultsLoading } from '../styles/design/layer/elementVaultsLoading'
import { elementSealVaultIdle } from '../styles/design/layer/elementSealVaultIdle'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const animation = require('../../assets/animation/consento_symbol_animation.gif')

const lockStyle: ViewStyle = {
  height: elementSealVaultActive.place.height,
  backgroundColor: elementSealVaultActive.backgroundColor,
  ...elementSealVaultActive.layers.borderBottom.borderStyle(ViewBorders.bottom),
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
    <ConsentoButton
      style={{
        top: elementSealVaultActive.layers.enabled.place.top,
        left: elementSealVaultActive.layers.enabled.place.left,
        width: elementSealVaultActive.layers.enabled.place.width,
        height: elementSealVaultActive.layers.enabled.place.height
      }}
      styleDisabled={{
        top: elementSealVaultIdle.layers.disabled.place.top,
        left: elementSealVaultIdle.layers.disabled.place.left,
        width: elementSealVaultIdle.layers.disabled.place.width,
        height: elementSealVaultIdle.layers.disabled.place.height
      }}
      title='lock'
      onPress={props.onPress}
    />
  </View>
}

export const VaultRouter = VaultNavigator.router
export const Vault = observer((): JSX.Element => {
  const { user, config } = useContext(ConsentoContext)
  const { vault } = useContext(VaultContext)
  const screenshots = useContext(ScreenshotContext)
  useEffect(() => {
    if (!vault.isOpen && !vault.isLoading) {
      vault.requestUnlock(config.expire * 1000)
    }
  }, [vault.isLoading])
  useEffect(() => {
    if (!vault.isOpen && !vault.isPending && !vault.isLoading) {
      navigate('vaults')
    }
  }, [vault.isPending, vault.isLoading])
  const handleNameEdit = vault.isOpen ? newName => vault.setName(newName) : undefined
  const handleDelete = (): void => {
    deleteWarning({
      onPress (): void {
        user.vaults.delete(vault)
        navigate('vaults')
      },
      itemName: 'Vault'
    })
  }
  const handleLock = vault.isClosable ? () => {
    navigate('vaults')
    vault.lock()
      .catch(lockError => console.error(lockError))
  } : undefined
  if (!vault.isOpen && !vault.isLoading) {
    screenshots.vaultPending.takeSync(1000)
  }
  return <PopupMenu>
    <Text>hi</Text>
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <TopNavigation title={vault.name} titlePlaceholder={vault.humanId} back='vaults' onEdit={handleNameEdit} onDelete={handleDelete} />
      {
        vault.isOpen
          ? [
            <LockButton key='lock' onPress={handleLock} />,
            <VaultNavigator key='vault' />
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
})
