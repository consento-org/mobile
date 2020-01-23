import React, { useContext } from 'react'
import { View, ViewStyle, ScrollView } from 'react-native'
import { VaultCard } from './components/VaultCard'
import { TopNavigation } from './components/TopNavigation'
import { Asset } from '../Asset'
import { observer } from 'mobx-react'
import { map } from '../util/map'
import { Vault } from '../model/Vault'
import { withNavigation, TNavigation } from './navigation'
import { useVUnits } from '../styles/Component'
import { elementCardVaultClose } from '../styles/component/elementCardVaultClose'
import { ConsentoContext } from '../model/Consento'
import { EmptyView } from './components/EmptyView'
import { elementVaultsEmpty } from '../styles/component/elementVaultsEmpty'

const listStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  marginTop: 10,
  marginBottom: 20
}

const AddButton = Asset.buttonAddHexagonal().component
const HorzPadding = 10

export const VaultsScreen = withNavigation(observer(({ navigation }: { navigation: TNavigation }) => {
  const { user: { vaults } } = useContext(ConsentoContext)
  const { vw } = useVUnits()
  const entryWidth = elementCardVaultClose.width
  let space = vw(100)
  let count = -1
  do {
    if (count === 0) {
      space -= entryWidth
    } else {
      space -= entryWidth + HorzPadding
    }
    count++
  } while (space > 0)
  const width = count * entryWidth + (count * 2 + 1) * HorzPadding

  return <View style={{ display: 'flex', height: '100%' }}>
    <TopNavigation title='Vaults' />
    <EmptyView prototype={elementVaultsEmpty}>
      {
        vaults.size > 0
          ? <View style={{ ...listStyle, width, left: (vw(100) - width) / 2 }}>
            {
              map(vaults.values(), vault => <VaultCard key={vault.$modelId} vault={vault} />)
            }
          </View>
          : undefined
      }
    </EmptyView>
    <AddButton
      style={{ position: 'absolute', right: 10, bottom: 10 }}
      onPress={() => {
        const vault = new Vault({})
        vaults.add(vault)
        navigation.navigate('vault', { vault: vault.$modelId })
      }}
    />
  </View>
}))
