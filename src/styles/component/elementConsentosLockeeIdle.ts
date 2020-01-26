// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Polygon, Link, Text, ImagePlacement } from '../Component'
import { Color } from '../Color'
import { elementConsentosBaseIdle } from './elementConsentosBaseIdle'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class ElementConsentosLockeeIdleClass extends Component {
  card: Polygon
  state = new Link(elementConsentosBaseIdle, { x: 0, y: 269, w: 340, h: 114 }, {
    deleteButtonLabel: 'deny',
    allowButtonLabel: 'allow'
  })
  lastAccess: Text
  outline: Polygon
  avatar: Polygon
  question: Text
  relationName: Text
  relationID: Text
  vaultName: Text
  vaultIcon: ImagePlacement
  constructor () {
    super('elementConsentosLockeeIdle', 340, 398, Color.black)
    this.card = new Polygon({ x: 0, y: 68, w: 340, h: 330 }, Color.white, {
      fill: Color.mediumGrey,
      thickness: 3,
      lineEnd: 'Butt',
      radius: 16
    }, [], this)
    this.lastAccess = new Text('23 Sec. ago', {
      ...TextStyles.TimestampRobotoSmallCapRegular10BlackLeft,
      textAlign: 'right'
    }, { x: 176, y: 78, w: 135, h: 33 }, this)
    this.outline = new Polygon({ x: 120, y: 6, w: 100, h: 100 }, Color.lightGrey, null, [], this)
    this.avatar = new Polygon({ x: 126, y: 12, w: 88, h: 88 }, '#d8d8d8ff', null, [], this)
    this.question = new Text('asks you to become a\nlockee for the vault:', TextStyles.BodyRobotoRegular18BlackCenter, { x: 0, y: 178, w: 340, h: 42 }, this)
    this.relationName = new Text('<Unnamed>', TextStyles.H5RobotoRegular24BlackCenter, { x: 0, y: 112, w: 340, h: 36 }, this)
    this.relationID = new Text('A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 16,
      textAlign: 'center'
    }, { x: 0, y: 146, w: 340, h: 24 }, this)
    this.vaultName = new Text('Vault  Name', TextStyles.H5RobotoRegular24BlackLeft, { x: 122, y: 230, w: 218, h: 36 }, this)
    this.vaultIcon = new ImagePlacement(Asset.iconVaultGrey, { x: 83, y: 236, w: 24, h: 24 }, this)
  }
}

export const elementConsentosLockeeIdle = new ElementConsentosLockeeIdleClass()
