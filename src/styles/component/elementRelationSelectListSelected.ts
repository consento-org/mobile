// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, ImagePlacement, Text, Polygon } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementRelationSelectListSelectedClass extends Component {
  icon: ImagePlacement
  avatarBg: ImagePlacement
  relationID: Text
  relationName: Text
  avatarCut: Polygon
  constructor () {
    super('elementRelationSelectListSelected', 375, 100)
    this.icon = new ImagePlacement(Asset.iconToggleCheckedGreen, { x: 323, y: 38.5, w: 24, h: 24 }, this)
    this.avatarBg = new ImagePlacement(Asset.elementAvatarIconBg, { x: 22, y: 11, w: 77, h: 79 }, this)
    this.relationID = new Text('A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey
    }, { x: 105, y: 62, w: 191, h: 24 }, this)
    this.relationName = new Text('John Malkovitch', TextStyles.H6RobotoMedium18BlackLeft, { x: 105, y: 38, w: 191, h: 24 }, this)
    this.avatarCut = new Polygon({ x: 34, y: 23, w: 54, h: 54 }, Color.blue, null, [], this)
  }
}

export const elementRelationSelectListSelected = new ElementRelationSelectListSelectedClass()
