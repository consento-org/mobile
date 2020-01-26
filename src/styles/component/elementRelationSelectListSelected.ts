// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, ImagePlacement, Text, Polygon } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementRelationSelectListSelectedClass extends Component {
  icon: ImagePlacement
  relationID: Text
  relationName: Text
  avatarCut: Polygon
  constructor () {
    super('elementRelationSelectListSelected', 375, 100)
    this.icon = new ImagePlacement(Asset.iconToggleCheckedGreen, { x: 323, y: 38.5, w: 24, h: 24 }, this)
    this.relationID = new Text('A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 14
    }, { x: 105, y: 56, w: 191, h: 24 }, this)
    this.relationName = new Text('<Unnamed>', TextStyles.H6RobotoMedium18BlackLeft, { x: 105, y: 30, w: 191, h: 24 }, this)
    this.avatarCut = new Polygon({ x: 31, y: 20, w: 60, h: 60 }, Color.blue, null, [], this)
  }
}

export const elementRelationSelectListSelected = new ElementRelationSelectListSelectedClass()
