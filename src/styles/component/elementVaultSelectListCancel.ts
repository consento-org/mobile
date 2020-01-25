// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, ImagePlacement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementVaultSelectListCancelClass extends Component {
  icon: ImagePlacement
  iconLabel: Text
  vaultName: Text
  vaultID: Text
  state: Text
  constructor () {
    super('elementVaultSelectListCancel', 375, 100)
    this.icon = new ImagePlacement(Asset.iconDeleteGrey, { x: 311.5, y: 23, w: 48, h: 48 }, this)
    this.iconLabel = new Text('Cancel', {
      ...TextStyles.BodyRobotoRegular18RedCenter,
      color: Color.activeGrey
    }, { x: 302, y: 60, w: 67, h: 20 }, this)
    this.vaultName = new Text('Vault  Name', TextStyles.H5RobotoRegular24BlackLeft, { x: 31, y: 20, w: 260, h: 36 }, this)
    this.vaultID = new Text('A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 14
    }, { x: 31, y: 55, w: 245, h: 24 }, this)
    this.state = new Text('pending…', {
      ...TextStyles.H6RobotoMedium18BlackLeft,
      color: Color.darkGrey,
      fontSize: 12,
      textAlign: 'right',
      textAlignVertical: 'top'
    }, { x: 310, y: 12, w: 51, h: 16 }, this)
  }
}

export const elementVaultSelectListCancel = new ElementVaultSelectListCancelClass()
