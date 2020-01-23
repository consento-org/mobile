import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Component, Text as TextComponent, ImagePlacement, Polygon } from '../../styles/Component'
import { observer } from 'mobx-react'
import { Avatar } from './Avatar'
import { IRelationEntry } from '../../model/Consento.types'

export interface IRelationListEntryPrototype extends Component {
  relationName: TextComponent
  icon: ImagePlacement
  iconLabel?: TextComponent
  relationID: TextComponent
  avatarBg: ImagePlacement
  avatarCut: Polygon
}

export interface IRelationListEntryProps {
  entry: IRelationEntry
  prototype: IRelationListEntryPrototype
  onPress: (entry: IRelationEntry) => void
}

export const RelationListEntry = observer(({ entry, prototype, onPress }: IRelationListEntryProps): JSX.Element => {
  return <TouchableOpacity style={{ height: prototype.height }} onPress={() => onPress(entry)}>
    <prototype.relationID.Render value={entry.humanId} />
    <prototype.relationName.Render horz='stretch' value={entry.name !== '' ? entry.name : null} />
    <prototype.icon.Render horz='end' />
    {prototype.iconLabel !== undefined ? <prototype.iconLabel.Render horz='end' /> : null}
    <Avatar
      avatarId={entry.avatarId}
      place={prototype.avatarCut.place}
    />
  </TouchableOpacity>
})
