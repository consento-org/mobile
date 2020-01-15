// This file has been generated with expo-export@3.6.0, a Sketch plugin.
import { Component, Text, ImagePlacement, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementRelationListItemClass extends Component {
  label: Text
  forwardIcon: ImagePlacement
  avatarBg: ImagePlacement
  iconCut: Polygon
  constructor () {
    super('elementRelationListItem', 375, 100)
    this.label = new Text('John Malkovitch', TextStyles.H6RobotoMedium18BlackLeft, { x: 105, y: 16, w: 210, h: 64 }, this)
    this.forwardIcon = new ImagePlacement(Asset.iconForwardGrey, { x: 315, y: 20, w: 60, h: 60 }, this)
    this.avatarBg = new ImagePlacement(Asset.elementAvatarIconBg, { x: 22, y: 11, w: 77, h: 79 }, this)
    this.iconCut = new Polygon({ x: 34, y: 23, w: 54, h: 54 }, Color.blue, null, [], this)
  }
}

export const elementRelationListItem = new ElementRelationListItemClass()
