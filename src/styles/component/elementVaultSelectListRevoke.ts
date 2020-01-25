// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, ImagePlacement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementVaultSelectListRevokeClass extends Component {
  icon: ImagePlacement
  iconLabel: Text
  vaultName: Text
  vaultID: Text
  constructor () {
    super('elementVaultSelectListRevoke', 375, 100)
    this.icon = new ImagePlacement(Asset.iconDeleteRed, { x: 311.5, y: 23, w: 48, h: 48 }, this)
    this.iconLabel = new Text('Revoke', TextStyles.BodyRobotoRegular18RedCenter, { x: 302, y: 60, w: 67, h: 20 }, this)
    this.vaultName = new Text('Vault  Name', TextStyles.H5RobotoRegular24BlackLeft, { x: 31, y: 20, w: 260, h: 36 }, this)
    this.vaultID = new Text('A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 14
    }, { x: 31, y: 55, w: 245, h: 24 }, this)
  }
}

export const elementVaultSelectListRevoke = new ElementVaultSelectListRevokeClass()
