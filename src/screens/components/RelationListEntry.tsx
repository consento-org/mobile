import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { observer } from 'mobx-react'
import { Avatar } from './Avatar'
import { IRelationEntry } from '../../model/Consento.types'
import { IImagePlacement, ILayer, IPolygon, ITextBox } from '../../styles/util/types'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { exists } from '../../styles/util/lang'
import { elementRelationListItem } from '../../styles/design/layer/elementRelationListItem'
import { elementRelationSelectListCancel } from '../../styles/design/layer/elementRelationSelectListCancel'
import { elementRelationSelectListSelected } from '../../styles/design/layer/elementRelationSelectListSelected'
import { elementRelationSelectListUnselected } from '../../styles/design/layer/elementRelationSelectListUnselected'
import { elementRelationSelectListRevoke } from '../../styles/design/layer/elementRelationSelectListRevoke'

export interface IRelationListEntryPrototype extends ILayer<{
  relationName: ITextBox
  icon: IImagePlacement
  iconLabel?: ITextBox
  relationID: ITextBox
  avatarCut: IPolygon
  state?: ITextBox
}> {}

const _types = {
  item: elementRelationListItem,
  cancel: elementRelationSelectListCancel,
  selected: elementRelationSelectListSelected,
  unselected: elementRelationSelectListUnselected,
  revoke: elementRelationSelectListRevoke
}
export type IRelationListEntryType = keyof typeof _types

const types: Record<IRelationListEntryType, IRelationListEntryPrototype> = _types
export const LIST_ENTRY_HEIGHT: number = Object
  .entries(types)
  .reduce<number | null>(
  (height, [type, proto]) => {
    if (height === null) {
      return proto.place.height
    }
    if (height !== proto.place.height) {
      throw new Error(`RelationListEntries need to be of the same height, but ${type} is of different height`)
    }
    return height
  }, null) as number

export interface IRelationListEntryProps<TEntry extends IRelationEntry> {
  entry: TEntry
  type: IRelationListEntryType
  onPress: (entry: IRelationEntry) => void
}

const styleCache = (() => {
  const cache = new WeakMap()
  return <TSource extends object, TStyles extends object> (src: TSource, create: (src: TSource) => TStyles) => {
    let result = cache.get(src)
    if (result === undefined) {
      result = StyleSheet.create(create(src))
      cache.set(src, result)
    }
    return result
  }
})()

export const RelationListEntry = observer(function <TEntry extends IRelationEntry>({ entry, type, onPress }: IRelationListEntryProps<TEntry>): JSX.Element {
  const src = types[type]
  const { state, relationID, relationName, icon, iconLabel, avatarCut } = src.layers
  const styles = styleCache(src, () => ({
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    container: {
      height: LIST_ENTRY_HEIGHT,
      display: 'flex',
      flexDirection: 'row'
    } as ViewStyle,
    sectionA: {
      paddingLeft: avatarCut.place.left,
      paddingTop: avatarCut.place.top,
      width: relationName.place.left
    },
    sectionB: {
      flexGrow: 1,
      marginTop: relationName.place.top
    },
    sectionC: {
      position: 'relative',
      width: relationName.place.right
    },
    relationID: {
      marginTop: relationID.place.spaceY(relationName.place)
    },
    state: {
      position: 'absolute',
      right: state?.place.right,
      top: state?.place.top
    },
    icon: {
      top: icon.place.top,
      right: icon.place.right,
      position: 'absolute',
      borderWidth: 1
    },
    iconLabel: {
      position: 'absolute',
      top: iconLabel?.place.top,
      width: iconLabel?.place.width,
      right: iconLabel?.place.right
    }
  }))
  return <TouchableOpacity style={styles.container} onPress={() => onPress(entry)}>
    <View style={styles.sectionA}>
      <Avatar avatarId={entry.avatarId} size={avatarCut.place.width} />
    </View>
    <View style={styles.sectionB}>
      <SketchElement src={relationName}>{entry.name !== '' ? entry.name : ''}</SketchElement>
      <SketchElement src={relationID} style={styles.relationID}>{entry.humanId}</SketchElement>
    </View>
    <View style={styles.sectionC}>
      <SketchElement src={icon} style={styles.icon} />
      {exists(state) ? <SketchElement src={state} style={styles.state} /> : null}
      {exists(iconLabel) ? <SketchElement src={iconLabel} style={styles.iconLabel} /> : null}
    </View>
  </TouchableOpacity>
})
