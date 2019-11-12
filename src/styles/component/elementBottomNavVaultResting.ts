// This file has been generated with expo-export, a Sketch plugin.
import { Component, ImagePlacement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

export class elementBottomNavVaultRestingClass extends Component {
  icon = new ImagePlacement(Asset.iconVaultIdle, { x: 37, y: 8, w: 23, h: 24 })
  title = new Text('Vaults', TextStyles.SubtitleRobotoRegular13BlackCenter, { x: 0, y: 37, w: 98, h: 16 })
  constructor () {
    super('elementBottomNavVaultResting', 98, 56)
  }
}

export const elementBottomNavVaultResting = new elementBottomNavVaultRestingClass()
