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

const listStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 20
}

const AddButton = Asset.buttonAddHexagonal().component

export const VaultsScreen = withNavigation(observer(({ navigation }: { navigation: TNavigation }) => {
  const { user: { vaults } } = useContext(ConsentoContext)
  return <View style={styles.screen}>
    <TopNavigation title='Vaults' />
    <ScrollView centerContent>
      <View style={listStyle}>
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
