import React, { useContext } from 'react'
import { View, ViewStyle, ScrollView } from 'react-native'
import { VaultCard } from './components/VaultCard'
import { styles } from '../styles'
import { TopNavigation } from './components/TopNavigation'
import { Asset } from '../Asset'
import { ConsentoContext } from '../model/ConsentoContext'
import { observer } from 'mobx-react'
import { map } from '../util/map'
import { Vault } from '../model/Vault'
import { withNavigation, TNavigation } from './navigation'
import { useVUnits } from '../util/useVUnits'
import { elementCardVaultClose } from '../styles/component/elementCardVaultClose'

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

  return <View style={styles.screen}>
    <TopNavigation title='Vaults' />
    <ScrollView centerContent>
      <View style={{ ...listStyle, width, left: (vw(100) - width) / 2 }}>
        {
          map(vaults.values(), vault => <VaultCard key={vault.$modelId} vault={vault} />)
        }
      </View>
    </ScrollView>
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
