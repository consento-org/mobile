import React from 'react'
import { View } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { styles } from '../styles'
import { Relation as RelationModel } from '../model/Relation'
import { observer } from 'mobx-react'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {}

export const Relation = observer(({ relation }: { relation: RelationModel }): JSX.Element => {
  return <View style={styles.screen}>
    <TopNavigation title={relation.displayName} back='relations' onDelete={noop} />
  </View>
})
