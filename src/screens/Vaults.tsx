import React, { useContext } from 'react'
import { View, useWindowDimensions, VirtualizedList } from 'react-native'
import { observer } from 'mobx-react'
import { ConsentoContext } from '../model/Consento'
import { ScreenshotContext, useScreenshotEnabled } from '../util/screenshots'
import { useIsFocused } from '@react-navigation/native'
import { navigate } from '../util/navigate'
import { ImageAsset } from '../styles/design/ImageAsset'
import { SketchImage } from '../styles/util/react/SketchImage'
import { createStackNavigator } from '@react-navigation/stack'
import { TopNavigation } from './components/TopNavigation'
import { EmptyView } from './components/EmptyView'
import { elementLocksEmpty } from '../styles/design/layer/elementLocksEmpty'
import { VaultCard, VAULT_STYLE } from './components/VaultCard'
import { ArraySet } from 'mobx-keystone'
import { Vault } from '../model/Vault'
import { MobxGrid } from './components/MobxGrid'

const AddButton = ImageAsset.buttonAddHexagonal

const Vaults = observer((): JSX.Element => {
  const { user: { vaults } } = useContext(ConsentoContext)
  const screenshots = useContext(ScreenshotContext)
  if (vaults.size === 0) {
    screenshots.vaultsEmpty.takeSync(500)
  }
  if (vaults.size > 0) {
    screenshots.vaultsFull.takeSync(500)
  }
  for (const vault of vaults) {
    if (vault.isPending) {
      screenshots.vaultsVaultOnePending.takeSync(500)
      break
    }
    if (!vault.isOpen) {
      screenshots.vaultsVaultOneLocked.takeSync(500)
      break
    }
  }
  return <View style={{ flexGrow: 1 }}>
    <TopNavigation title='Vaults' />
    <SketchImage
      src={AddButton}
      style={{ position: 'absolute', right: 10, bottom: 10, zIndex: 1 }}
      onPress={() => {
        const vault = new Vault({})
        vaults.add(vault)
        navigate('vault', { vault: vault.$modelId })
      }}
    />
    <EmptyView empty={elementLocksEmpty} isEmpty={vaults.size === 0}>
      <MobxGrid arraySet={vaults} itemStyle={VAULT_STYLE} renderItem={vault => <VaultCard key={`vault-card-${vault.$modelId}`} vault={vault} />} />
    </EmptyView>
  </View>
})

const Pages = createStackNavigator()

export const VaultsScreen = (): JSX.Element => {
  return <Vaults />
  /*
  const isScreenshotEnabled = useScreenshotEnabled()
  const isFocused = useIsFocused()
  return <Pages.Navigator screenOptions={{
    headerShown: false,
    cardShadowEnabled: false,
    cardStyle: {
      flexGrow: 1
    }
  }}>
    <Pages.Screen name='vault' component={VaultDisplay} />
    <Pages.Screen name='vaults' component={Vaults} />
  </Pages.Navigator>
  */
}
