// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, ImagePlacement, Polygon, Text } from '../Component'
import { Asset } from '../../Asset'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementRelationSelectListRevokeCopyClass extends Component {
  icon: ImagePlacement
  avatarCut: Polygon
  iconLabel: Text
  relationID: Text
  relationName: Text
  state: Text
  constructor () {
    super('elementRelationSelectListRevokeCopy', 375, 100)
    this.icon = new ImagePlacement(Asset.iconDeleteGrey, { x: 311.5, y: 23, w: 48, h: 48 }, this)
    this.avatarCut = new Polygon({ x: 31, y: 20, w: 60, h: 60 }, Color.blue, null, [], this)
    this.iconLabel = new Text('Cancel', {
      ...TextStyles.BodyRobotoRegular18RedCenter,
      color: Color.activeGrey
    }, { x: 302, y: 60, w: 67, h: 20 }, this)
    this.relationID = new Text('A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 14
    }, { x: 105, y: 56, w: 191, h: 24 }, this)
    this.relationName = new Text('<Unnamed>', {
      ...TextStyles.H6RobotoMedium18BlackLeft,
      color: Color.darkGrey
    }, { x: 105, y: 30, w: 191, h: 24 }, this)
    this.state = new Text('pending…', {
      ...TextStyles.H6RobotoMedium18BlackLeft,
      color: Color.darkGrey,
      fontSize: 12,
      textAlign: 'right',
      textAlignVertical: 'top'
    }, { x: 311.5, y: 0, w: 51, h: 36 }, this)
  }
}

export const elementRelationSelectListRevokeCopy = new ElementRelationSelectListRevokeCopyClass()
