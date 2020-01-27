// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Polygon, Link, ImagePlacement, Text } from '../Component'
import { Color } from '../Color'
import { elementAvatarPlaceholder } from './elementAvatarPlaceholder'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementConsentosBaseClass extends Component {
  background: Polygon
  avatar = new Link(elementAvatarPlaceholder, { x: 11, y: 30, w: 60, h: 60 }, {})
  vaultIcon: ImagePlacement
  vaultName: Text
  relationName: Text
  actionRequested: Text
  relationID: Text
  lastAccess: Text
  constructor () {
    super('elementConsentosBase', 340, 280, Color.black)
    this.background = new Polygon({ x: 0, y: 0, w: 340, h: 280 }, Color.white, {
      fill: Color.mediumGrey,
      thickness: 3,
      lineEnd: 'Butt',
      radius: 16
    }, [], this)
    this.vaultIcon = new ImagePlacement(Asset.iconVaultGrey, { x: 29, y: 128, w: 24, h: 24 }, this)
    this.vaultName = new Text('Vault  Name', TextStyles.H5RobotoRegular24BlackLeft, { x: 80, y: 120, w: 260, h: 36 }, this)
    this.relationName = new Text('<Unnamed>', TextStyles.H5RobotoRegular24BlackLeft, { x: 80, y: 30, w: 223, h: 36 }, this)
    this.actionRequested = new Text('requests access to:', TextStyles.BodyRobotoRegular18BlackLeft, { x: 80, y: 90, w: 223, h: 24 }, this)
    this.relationID = new Text('A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 16
    }, { x: 80, y: 61, w: 245, h: 24 }, this)
    this.lastAccess = new Text('23 Sec. ago', {
      ...TextStyles.TimestampRobotoSmallCapRegular10BlackLeft,
      textAlign: 'right'
    }, { x: 86, y: 10, w: 232, h: 33 }, this)
  }
}

export const elementConsentosBase = new ElementConsentosBaseClass()
