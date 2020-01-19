// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, ImagePlacement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementBottomNavVaultRestingClass extends Component {
  icon: ImagePlacement
  title: Text
  constructor () {
    super('elementBottomNavVaultResting', 98, 56)
    this.icon = new ImagePlacement(Asset.iconVaultIdle, { x: 37, y: 8, w: 23, h: 24 }, this)
    this.title = new Text('Vaults', TextStyles.SubtitleRobotoRegular13BlackCenter, { x: 0, y: 37, w: 98, h: 16 }, this)
  }
}

export const elementBottomNavVaultResting = new ElementBottomNavVaultRestingClass()
