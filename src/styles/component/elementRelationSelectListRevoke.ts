// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, ImagePlacement, Polygon, Text } from '../Component'
import { Asset } from '../../Asset'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementRelationSelectListRevokeClass extends Component {
  icon: ImagePlacement
  avatarCut: Polygon
  iconLabel: Text
  relationID: Text
  relationName: Text
  constructor () {
    super('elementRelationSelectListRevoke', 375, 100)
    this.icon = new ImagePlacement(Asset.iconDeleteRed, { x: 311.5, y: 23, w: 48, h: 48 }, this)
    this.avatarCut = new Polygon({ x: 31, y: 20, w: 60, h: 60 }, Color.blue, null, [], this)
    this.iconLabel = new Text('Revoke', TextStyles.BodyRobotoRegular18RedCenter, { x: 302, y: 60, w: 67, h: 20 }, this)
    this.relationID = new Text('A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 14
    }, { x: 105, y: 56, w: 191, h: 24 }, this)
    this.relationName = new Text('<Unnamed>', TextStyles.H6RobotoMedium18BlackLeft, { x: 105, y: 30, w: 191, h: 24 }, this)
  }
}

export const elementRelationSelectListRevoke = new ElementRelationSelectListRevokeClass()
