import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Component, Text as TextComponent, ImagePlacement } from '../../styles/Component'
import { observer } from 'mobx-react'
import { exists } from '../../util/exists'

export interface IRelationListEntryPrototype extends Component {
  relationName: TextComponent
  icon: ImagePlacement
  iconLabel?: TextComponent
  relationID: TextComponent
  avatarBg: ImagePlacement
}

export interface IRelationEntry {
  readonly humanId: string
  readonly name: string
}

export interface IRelationListEntryProps {
  entry: IRelationEntry
  prototype: IRelationListEntryPrototype
  onPress: (entry: IRelationEntry) => void
}

export const RelationListEntry = observer(({ entry, prototype, onPress }: IRelationListEntryProps): JSX.Element => {
  return <TouchableOpacity style={{ height: prototype.height }} onPress={() => onPress(entry)}>
    <prototype.relationID.Render value={entry.humanId} />
    <prototype.relationName.Render horz='stretch' value={exists(entry.name) ? entry.name : ''} />
    <prototype.icon.Render horz='end' />
    {prototype.iconLabel !== undefined ? <prototype.iconLabel.Render horz='end' /> : null}
    <prototype.avatarBg.Render />
  </TouchableOpacity>
})
