import React, { useContext } from 'react'
import { View, Text, useWindowDimensions, FlatList, VirtualizedList } from 'react-native'
import { observer } from 'mobx-react'
import { Vault } from '../model/Vault'
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

const AddButton = ImageAsset.buttonAddHexagonal

const NewVault = () => {
  return <View />
}

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
  const { width, height } = useWindowDimensions()
  const numColumns = width / VAULT_STYLE.width | 0
  const numVaults = vaults.size
  const initialNumToRender = Math.ceil(height / VAULT_STYLE.height)
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
      <VirtualizedList
        data={vaults}
        listKey={`vaults-list-${numColumns}`}
        getItem={(vaults: ArraySet<Vault>, index: number): Vault[] => vaults.items.slice((index * numColumns), (index * numColumns) + numColumns)}
        getItemCount={() => Math.ceil(numVaults / numColumns)}
        centerContent
        initialNumToRender={initialNumToRender}
        style={{ height: 0 /* React-navigation fix - TODO check if new version fixes this or file bug */ }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={vaultRow => {
          return <View style={{ alignSelf: 'center', flexDirection: 'row', width: numColumns * VAULT_STYLE.width + ((numColumns) * VAULT_STYLE.marginHorizontal * 2) }}>
            {
              vaultRow.item.map(vault => {
                return <VaultCard key={vault.$modelId} vault={vault} />
              })
            }
          </View>
        }}
      />
    </EmptyView>
  </View>
})

const Pages = createStackNavigator()

export const VaultsScreen = (): JSX.Element => {
  const isScreenshotEnabled = useScreenshotEnabled()
  const isFocused = useIsFocused()
  return <Pages.Navigator screenOptions={{
    headerShown: false,
    cardShadowEnabled: false,
    cardStyle: {
      flexGrow: 1
    }
  }}>
    <Pages.Screen name='vaults' component={Vaults} />
    <Pages.Screen name='new-vault' component={NewVault} />
  </Pages.Navigator>
}
