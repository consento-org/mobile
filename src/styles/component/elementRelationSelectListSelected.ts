// This file has been generated with expo-export@3.6.0, a Sketch plugin.
import { Component, Text, ImagePlacement, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementRelationSelectListSelectedClass extends Component {
  relationName: Text
  icon: ImagePlacement
  avatarBg: ImagePlacement
  avatarCut: Polygon
  constructor () {
    super('elementRelationSelectListSelected', 375, 100)
    this.relationName = new Text('John Malkovitch', TextStyles.H6RobotoMedium18BlackLeft, { x: 105, y: 16, w: 218, h: 64 }, this)
    this.icon = new ImagePlacement(Asset.iconToggleCheckedGreen, { x: 323, y: 38.5, w: 24, h: 24 }, this)
    this.avatarBg = new ImagePlacement(Asset.elementAvatarIconBg, { x: 22, y: 11, w: 77, h: 79 }, this)
    this.avatarCut = new Polygon({ x: 34, y: 23, w: 54, h: 54 }, Color.blue, null, [], this)
  }
}

export const elementRelationSelectListSelected = new ElementRelationSelectListSelectedClass()
