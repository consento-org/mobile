import React, { useContext } from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react'
import { TopNavigation } from './components/TopNavigation'
import { EmptyView } from './components/EmptyView'
import { elementRelationsEmpty } from '../styles/component/elementRelationsEmpty'
import { Asset } from '../Asset'
import { TNavigation } from './navigation'
import { elementRelationListItem } from '../styles/component/elementRelationListItem'
import { RelationListEntry, IRelationEntry } from './components/RelationListEntry'
import { ConsentoContext } from '../model/Consento'
import { withNavigationFocus } from 'react-navigation'

const AddButton = Asset.buttonAddRound().component

export interface IRelationListProps {
  entries: IRelationEntry[]
  navigation: TNavigation
}

const RelationsList = observer(({ entries, navigation }: IRelationListProps): JSX.Element => {
  const onPress = (entry: IRelationEntry): void => {
    navigation.navigate('relation', { relation: entry.$modelId })
  }
  return <>
    {entries.map(entry => <RelationListEntry prototype={elementRelationListItem} key={entry.$modelId} entry={entry} onPress={onPress} />)}
  </>
})

const FocussedRelationsScreen = observer(({ navigation }: { navigation: TNavigation }) => {
  const { user } = useContext(ConsentoContext)
  const relations = user.relationsSorted
  return <View style={{ flex: 1 }}>
    <TopNavigation title='Relations' />
    <EmptyView prototype={elementRelationsEmpty}>
      {relations.length > 0 ? <RelationsList entries={relations} navigation={navigation} /> : null}
    </EmptyView>
    <AddButton style={{ position: 'absolute', right: 10, bottom: 10 }} onPress={() => navigation.navigate('newRelation', { timestamp: Date.now() })} />
  </View>
})

export const RelationsScreen = withNavigationFocus(({ navigation, isFocused }: { navigation: TNavigation, isFocused: boolean }) => {
  if (isFocused) {
    return <FocussedRelationsScreen navigation={navigation} />
  }
  return <View />
})
