// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Text, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class ElementVaultSelectListItemClass extends Component {
  vaultName: Text
  vaultID: Text
  icon: ImagePlacement
  constructor () {
    super('elementVaultSelectListItem', 375, 100)
    this.vaultName = new Text('Vault  Name', TextStyles.H5RobotoRegular24BlackLeft, { x: 31, y: 20, w: 260, h: 36 }, this)
    this.vaultID = new Text('A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 14
    }, { x: 31, y: 55, w: 245, h: 24 }, this)
    this.icon = new ImagePlacement(Asset.iconForwardGrey, { x: 315, y: 20, w: 60, h: 60 }, this)
  }
}

export const elementVaultSelectListItem = new ElementVaultSelectListItemClass()
