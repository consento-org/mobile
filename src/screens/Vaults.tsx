import React, { useContext } from 'react'
import { View, ViewStyle, ScrollView } from 'react-native'
import { VaultCard } from './components/VaultCard'
import { styles } from '../styles'
import { TopNavigation } from './components/TopNavigation'
import { Asset } from '../Asset'
import { ConsentoContext } from '../model/ConsentoContext'
import { observer } from 'mobx-react'
import { map } from '../util/map'

const listStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 20
}

const AddButton = Asset.buttonAddHexagonal().component

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {}

export const VaultsScreen = observer(() => {
  const { user: { vaults } } = useContext(ConsentoContext)
  /*
  useEffect(() => {
    setTimeout(() => {
      vaults.push({
        key: 'abcd' + Date.now(),
        name: 'alfalfa',
        state: TVaultState.open
      })
      setState(Date.now())
    }, 2000)
  }, [false])
  */
  return <View style={styles.screen}>
    <TopNavigation title='Vaults' />
    <ScrollView centerContent>
      <View style={listStyle}>
        {
          map(vaults.values(), vault => <VaultCard key={vault.$modelId} vault={vault} />)
        }
      </View>
    </ScrollView>
    <AddButton style={{ position: 'absolute', right: 10, bottom: 10 }} onPress={noop} />
  </View>
})
