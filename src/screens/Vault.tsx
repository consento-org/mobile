import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { Logs } from './Logs'
import { observer } from 'mobx-react'
import { Vault as VaultModel } from '../model/Vault'
import { PopupMenu } from './components/PopupMenu'
import { FileList } from './components/FileList'
import { Locks } from './components/Locks'
import { createMaterialTopTabNavigator, MaterialTopTabBarOptions, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs'
import { SketchElement } from '../styles/util/react/SketchElement'
import { LockButton } from './components/LockButton'
import { ContextMenu } from './components/ContextMenu'
import { elementTabBarTabActive } from '../styles/design/layer/elementTabBarTabActive'
import { elementTabBarTabResting } from '../styles/design/layer/elementTabBarTabResting'
import { useConsento, useUser } from '../model/Consento'
import { isScreenshotEnabled, screenshots } from '../util/screenshots'
import { deleteWarning } from './components/deleteWarning'
import { navigate } from '../util/navigate'
import { Waiting } from './components/Waiting'
import { exists } from '../styles/util/lang'
import { ErrorCode, ErrorScreen } from './ErrorScreen'
import { User } from '../model/User'
import { VaultContext } from '../model/VaultContext'
import { useIsFocused } from '@react-navigation/native'

const Tab = createMaterialTopTabNavigator()

function labelOptions (label: string): MaterialTopTabNavigationOptions {
  return {
    tabBarLabel: ({ focused }: { focused: boolean }) =>
      <SketchElement
        src={focused ? elementTabBarTabActive.layers.label : elementTabBarTabResting.layers.label}
        style={{ width: 120 /* TODO: constant is ugly hack needed to prevent wraping when text turns bold */ }}
      >{label}</SketchElement>
  }
}

const tabBarOptions: MaterialTopTabBarOptions = {
  indicatorStyle: {
    backgroundColor: elementTabBarTabActive.layers.bottomLine.svg?.stroke,
    height: elementTabBarTabActive.layers.bottomLine.svg?.strokeWidth ?? 1
  },
  pressColor: elementTabBarTabResting.layers.effect.fill.color,
  style: {
    backgroundColor: elementTabBarTabResting.backgroundColor,
    height: elementTabBarTabResting.place.height,
    shadowOpacity: 0,
    elevation: 0
  }
}

const labels = {
  files: labelOptions('Files'),
  locks: labelOptions('Locks'),
  logs: labelOptions('Logs')
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, display: 'flex' }
})

export const Vault = observer(({ vaultId }: { vaultId: string }): JSX.Element => {
  const user = useUser()
  const vault = user.findVault(vaultId)
  if (!exists(vault)) {
    return <ErrorScreen code={ErrorCode.noVault} />
  }
  return <VaultAvailable vault={vault} user={user} />
})

const VaultAvailable = observer(({ user, vault }: { user: User, vault: VaultModel }): JSX.Element => {
  const { config } = useConsento()
  useEffect(() => {
    if (!vault.isOpen && !vault.isLoading) {
      setTimeout(() => vault.requestUnlock((config?.expire ?? 1) * 1000), 0)
    }
  }, [vault.isLoading])
  useEffect(() => {
    if (!vault.isOpen && !vault.isPending && !vault.isLoading) {
      handleBack()
    }
  }, [vault.isPending, vault.isLoading])
  if (isScreenshotEnabled && useIsFocused()) {
    if (!vault.isOpen && !vault.isLoading) {
      screenshots.vaultPending.takeSync(1000)
    }
  }
  const handleNameEdit = vault.isOpen ? (newName: string) => vault.setName(newName) : undefined
  const handleDelete = (): void => {
    deleteWarning({
      onPress (): void {
        handleBack()
        user.vaults.delete(vault)
      },
      itemName: 'Vault'
    })
  }
  const handleLock = vault.isClosable ? () => {
    handleBack()
    setImmediate(() => {
      vault.lock()
        .catch(lockError => console.error(lockError))
    })
  } : undefined
  const handleBack = (): void => navigate(['main', 'vaults'])
  return <VaultContext.Provider value={{ vault }}><PopupMenu><ContextMenu>
    <View style={styles.container}>
      <TopNavigation title={vault.name} titlePlaceholder={vault.humanId} back={handleBack} onEdit={handleNameEdit} onDelete={handleDelete} />
      {
        vault.isOpen
          ? <>
            <LockButton onPress={handleLock} />
            <Tab.Navigator tabBarOptions={tabBarOptions} lazy removeClippedSubviews>
              <Tab.Screen name='files' component={FileList} options={labels.files} />
              <Tab.Screen name='locks' component={Locks} options={labels.locks} />
              <Tab.Screen name='logs' component={Logs} options={labels.logs} />
            </Tab.Navigator>
          </>
          : <Waiting vault={vault} onClose={handleBack} />
      }
    </View>
  </ContextMenu></PopupMenu></VaultContext.Provider>
})
