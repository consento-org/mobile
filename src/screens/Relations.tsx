import React, { useContext } from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react'
import { TopNavigation } from './components/TopNavigation'
import { EmptyView } from './components/EmptyView'
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

export const RelationsScreen = observer(() => {
  const { user } = useContext(ConsentoContext)
  const relations = user.relations
  if (useScreenshotEnabled()) {
    const screenshots = useContext(ScreenshotContext)
    if (relations.size === 0) screenshots.relationsEmpty.takeSync(300)
    if (relations.size === 1) screenshots.relationsOne.takeSync(300)
    if (relations.size === 2) screenshots.relationsTwo.takeSync(300)
  }
  const handlePress = (entry: IRelationEntry): void => {
    navigate('relation', { relation: entry.relationId })
  }
  return <View style={{ flex: 1 }}>
    <TopNavigation title='Relations' />
    <EmptyView empty={elementRelationsEmpty}>
      {
        relations.size > 0
          ? <MobxList
            data={relations}
            sort={compareNames}
            itemStyle={{ height: LIST_ENTRY_HEIGHT }}
            renderItem={entry =>
              <RelationListEntry type='item' key={entry.relationId} entry={entry} onPress={handlePress} />}
          />
          : undefined
      }
    </EmptyView>
    <SketchElement src={ImageAsset.buttonAddRound} style={{ position: 'absolute', right: 10, bottom: 10 }} onPress={() => navigate('newRelation', { timestamp: Date.now() })} />
  </View>
})
