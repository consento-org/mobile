import React, { useContext } from 'react'
import { View, ScrollView } from 'react-native'
import { observer } from 'mobx-react'
import { styles } from '../styles'
import { TopNavigation } from './components/TopNavigation'
import { EmptyView } from './components/EmptyView'
import { elementRelationsEmpty } from '../styles/component/elementRelationsEmpty'
import { Asset } from '../Asset'
import { withNavigation, TNavigation } from './navigation'
import { ConsentoContext } from '../model/ConsentoContext'
import { elementRelationListItem } from '../styles/component/elementRelationListItem'
import { Relation } from '../model/Relation'
import { TouchableOpacity } from 'react-native-gesture-handler'

const AddButton = Asset.buttonAddRound().component

function RelationListEntry ({ relation }: { relation: Relation }): JSX.Element {
  return <TouchableOpacity style={{ height: elementRelationListItem.height }}>
    <elementRelationListItem.label.Render horz='stretch' value={relation.displayName} />
    <elementRelationListItem.forwardIcon.Render horz='end' />
    <elementRelationListItem.avatarBg.Render />
  </TouchableOpacity>
}

const RelationsList = observer((): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  return <ScrollView centerContent>
    {
      user.relationsSorted.map(relation => <RelationListEntry key={relation.$modelId} relation={relation} />)
    }
  </ScrollView>
})

export const RelationsScreen = withNavigation(({ navigation }: { navigation: TNavigation }) => {
  const { user: { relations } } = useContext(ConsentoContext)
  return <View style={{ ...styles.screen }}>
    <TopNavigation title='Relations' />
    {relations.size === 0 ? <EmptyView prototype={elementRelationsEmpty} /> : <RelationsList />}
    <AddButton style={{ position: 'absolute', right: 10, bottom: 10 }} onPress={() => navigation.navigate('newRelation', { timestamp: Date.now() })} />
  </View>
})
