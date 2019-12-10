import React from 'react'
import { View } from 'react-native'
import { styles } from '../styles'
import { TopNavigation } from './components/TopNavigation'
import { EmptyView } from './components/EmptyView'
import { elementRelationsEmpty } from '../styles/component/elementRelationsEmpty'
import { Asset } from '../Asset'
import { withNavigation, TNavigation } from './navigation'

const AddButton = Asset.buttonAddRound().component

export const RelationsScreen = withNavigation(({ navigation }: { navigation: TNavigation }) => {
  return <View style={{ ...styles.screen }}>
    <TopNavigation title="Relations"/>
    <EmptyView prototype={ elementRelationsEmpty } />
    <AddButton style={{ position: 'absolute', right: 10, bottom: 10 }} onPress={ () => navigation.navigate('newRelation', { timestamp: Date.now() }) }/>
  </View>
})
