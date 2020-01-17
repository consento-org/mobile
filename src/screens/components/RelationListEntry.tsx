import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Component, Text as TextComponent, ImagePlacement } from '../../styles/Component'
import { observer } from 'mobx-react'
import { IDisplayName } from '../../util/compareNames'

export interface IRelationListEntryPrototype extends Component {
  relationName: TextComponent
  icon: ImagePlacement
  iconLabel?: TextComponent
  avatarBg: ImagePlacement
}

export interface IRelationEntry extends IDisplayName {
  readonly $modelId: string
}

export interface IRelationListEntryProps {
  entry: IRelationEntry
  prototype: IRelationListEntryPrototype
  onPress: (entry: IRelationEntry) => void
}

export const RelationListEntry = observer(({ entry, prototype, onPress }: IRelationListEntryProps): JSX.Element => {
  return <TouchableOpacity style={{ height: prototype.height }} onPress={() => onPress(entry)}>
    <prototype.relationName.Render horz='stretch' value={entry.displayName} />
    <prototype.icon.Render horz='end' />
    {prototype.iconLabel !== undefined ? <prototype.iconLabel.Render horz='end' /> : null}
    <prototype.avatarBg.Render />
  </TouchableOpacity>
})
