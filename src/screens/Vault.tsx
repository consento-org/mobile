import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { Logs } from './Logs'
import { observer } from 'mobx-react'
import { VaultContext } from '../model/VaultContext'
import { PopupMenu } from './components/PopupMenu'
import { FileList } from './components/FileList'
import { Locks } from './components/Locks'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { SketchElement } from '../styles/util/react/SketchElement'
import { LockButton } from './components/LockButton'
import { ContextMenu } from './components/ContextMenu'
import { elementTabBarTabActive } from '../styles/design/layer/elementTabBarTabActive'
import { elementTabBarTabResting } from '../styles/design/layer/elementTabBarTabResting'
import { ConsentoContext } from '../model/Consento'
import { ScreenshotContext, useScreenshotEnabled } from '../util/screenshots'
import { deleteWarning } from './components/deleteWarning'
import { navigate } from '../util/navigate'
import { assertExists } from '../util/assertExists'
import { Waiting } from './components/Waiting'

const Tab = createMaterialTopTabNavigator()

function labelOptions (label: string): any {
  return {
    tabBarLabel: ({ focused }: { focused: boolean }) =>
      <SketchElement
        src={focused ? elementTabBarTabActive.layers.label : elementTabBarTabResting.layers.label}
        style={{ width: 120 /* TODO: constant is ugly hack needed to prevent wraping when text turns bold */ }}
      >{label}</SketchElement>
  }
}

const tabBarOptions = {
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

export const Vault = observer((): JSX.Element => {
  const consento = useContext(ConsentoContext)
  assertExists(consento)
  const { user, config } = consento
  const { vault } = useContext(VaultContext)
  if (vault === null) {
    throw new Error('not in vault context')
  }
  const back = ['main', 'vaults']
  useEffect(() => {
    if (!vault.isOpen && !vault.isLoading) {
      console.log({ time: (config?.expire ?? 1) * 1000, expire: config?.expire })
      setTimeout(() => vault.requestUnlock((config?.expire ?? 1) * 1000), 0)
    }
  }, [vault.isLoading])
  useEffect(() => {
    if (!vault.isOpen && !vault.isPending && !vault.isLoading) {
      navigate(back)
    }
  }, [vault.isPending, vault.isLoading])
  if (useScreenshotEnabled()) {
    const screenshots = useContext(ScreenshotContext)
    if (!vault.isOpen && !vault.isLoading) {
      screenshots.vaultPending.takeSync(1000)
    }
  }
  const handleNameEdit = vault.isOpen ? (newName: string) => vault.setName(newName) : undefined
  const handleDelete = (): void => {
    deleteWarning({
      onPress (): void {
        navigate(back)
        user.vaults.delete(vault)
      },
      itemName: 'Vault'
    })
  }
  const handleLock = vault.isClosable ? () => {
    navigate(back)
    setImmediate(() => {
      vault.lock()
        .catch(lockError => console.error(lockError))
    })
  } : undefined
  const handleBack = (): void => navigate(back)
  return <PopupMenu><ContextMenu>
    <VaultContext.Provider value={{ vault }}>
      <View style={{ flexGrow: 1, display: 'flex' }}>
        <TopNavigation title={vault.name ?? '-vault-name-missing-'} titlePlaceholder={vault.humanId} back={back} onEdit={handleNameEdit} onDelete={handleDelete} />
        {
          vault.isOpen
            ? <>
              <LockButton onPress={handleLock} />
              <Tab.Navigator tabBarOptions={tabBarOptions}>
                <Tab.Screen name='files' component={FileList} options={labelOptions('Files')} />
                <Tab.Screen name='locks' component={Locks} options={labelOptions('Locks')} />
                <Tab.Screen name='logs' component={Logs} options={labelOptions('Logs')} />
              </Tab.Navigator>
            </>
            : <Waiting vault={vault} onClose={handleBack} />
        }
      </View>
    </VaultContext.Provider>
  </ContextMenu></PopupMenu>
})
