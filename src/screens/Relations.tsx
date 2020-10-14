import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react'
import { TopNavigation } from './components/TopNavigation'
import { createEmptyView } from './components/EmptyView'
import { LIST_ENTRY_HEIGHT, RelationListEntry } from './components/RelationListEntry'
import { IRelationEntry } from '../model/Consento.types'
import { ConsentoContext } from '../model/Consento'
import { ScreenshotContext, useScreenshotEnabled } from '../util/screenshots'
import { navigate } from '../util/navigate'
import { elementRelationsEmpty } from '../styles/design/layer/elementRelationsEmpty'
import { MobxList } from './components/MobxList'
import { compareNames } from '../util/compareNames'
import { ImageAsset } from '../styles/design/ImageAsset'
import { SketchElement } from '../styles/util/react/SketchElement'
import { Color } from '../styles/design/Color'
import { Relation } from '../model/Relation'
import { assertExists } from '../util/assertExists'

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { backgroundColor: Color.white /* TODO: create design screen */ },
  item: { height: LIST_ENTRY_HEIGHT },
  add: { position: 'absolute', right: 10, bottom: 10 }
})

const handlePress = (entry: IRelationEntry): void => navigate('relation', { relation: entry.relationId })
const handleAdd = (): void => navigate('newRelation', { timestamp: Date.now() })

const renderRelation = (relation: Relation): JSX.Element =>
  <RelationListEntry type='item' key={relation.relationId} entry={relation} onPress={handlePress} />

const EmptyView = createEmptyView(elementRelationsEmpty)

export const RelationsScreen = observer(() => {
  const consento = useContext(ConsentoContext)
  assertExists(consento)
  const { user } = consento
  const relations = user.relations
  if (useScreenshotEnabled()) {
    const screenshots = useContext(ScreenshotContext)
    if (relations.size === 0) screenshots.relationsEmpty.takeSync(300)
    if (relations.size === 1) screenshots.relationsOne.takeSync(300)
    if (relations.size === 2) screenshots.relationsTwo.takeSync(300)
  }
  return <View style={styles.container}>
    <TopNavigation title='Relations' />
    <EmptyView isEmpty={relations.size === 0}>
      <MobxList
        data={relations}
        sort={compareNames}
        style={styles.list}
        itemStyle={styles.item}
        renderItem={renderRelation}
      />
    </EmptyView>
    <SketchElement src={ImageAsset.buttonAddRound} style={styles.add} onPress={handleAdd} />
  </View>
})
