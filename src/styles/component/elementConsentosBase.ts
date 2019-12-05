// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Link, ImagePlacement, Text } from '../Component'
import { Color } from '../Color'
import { elementAvatarPlaceholder } from './elementAvatarPlaceholder'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementConsentosBaseClass extends Component {
  background = new Polygon({ x: 0, y: 0, w: 340, h: 270 }, Color.white, {
    fill: Color.mediumGrey,
    thickness: 3,
    lineEnd: 'Butt',
    radius: 16
  }, [])
  avatar = new Link(elementAvatarPlaceholder, { x: 11, y: 30, w: 60, h: 60 }, {})
  vaultIcon: ImagePlacement
  vaultName: Text
  relationName: Text
  actionRequested: Text
  lastAccess: Text
  constructor () {
    super('elementConsentosBase', 340, 270, Color.black)
    this.vaultIcon = new ImagePlacement(Asset.iconVaultGrey, { x: 29, y: 111, w: 24, h: 24 }, this)
    this.vaultName = new Text('Vault  Name', TextStyles.H5RobotoRegular24BlackLeft, { x: 80, y: 103, w: 207, h: 36 }, this)
    this.relationName = new Text('Name', TextStyles.H5RobotoRegular24BlackLeft, { x: 86, y: 30, w: 223, h: 36 }, this)
    this.actionRequested = new Text('requests access to:', TextStyles.BodyRobotoRegular18BlackLeft, { x: 86, y: 66, w: 223, h: 24 }, this)
    this.lastAccess = new Text('23 Sec. ago', {
      ... TextStyles.TimestampRobotoSmallCapRegular10BlackLeft,
      textAlign: 'right'
    }, { x: 86, y: 10, w: 232, h: 33 }, this)
  }
}

export const elementConsentosBase = new ElementConsentosBaseClass()
