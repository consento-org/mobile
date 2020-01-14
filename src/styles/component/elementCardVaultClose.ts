// This file has been generated with expo-export@3.5.2, a Sketch plugin.
import { Component, ImagePlacement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementCardVaultCloseClass extends Component {
  background: ImagePlacement
  title: Text
  lastAccess: Text
  status: Text
  icon: ImagePlacement
  constructor () {
    super('elementCardVaultClose', 160, 161)
    this.background = new ImagePlacement(Asset.elementCardVaultBackground, { x: 0, y: 31, w: 160, h: 130 }, this)
    this.title = new Text('Name', TextStyles.H6RobotoMedium18BlackCenter, { x: 5, y: 86, w: 150, h: 56 }, this)
    this.lastAccess = new Text('Last access: 02.10.2019', TextStyles.TimestampRobotoSmallCapRegular10BlackLeft, { x: 5, y: 141, w: 150, h: 16 }, this)
    this.status = new Text('sealed', TextStyles.TITLERobotoSmallCapRegular12RedCenter, { x: 5, y: 61, w: 150, h: 26 }, this)
    this.icon = new ImagePlacement(Asset.iconVaultBigClosed, { x: 52.5, y: 0, w: 55, h: 62 }, this)
  }
}

export const elementCardVaultClose = new ElementCardVaultCloseClass()
