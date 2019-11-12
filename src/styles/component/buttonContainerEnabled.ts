// This file has been generated with expo-export, a Sketch plugin.
import { Component, Slice9Placement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

export class buttonContainerEnabledClass extends Component {
  bg = new Slice9Placement(Asset.buttonBackgroundEnabled, { x: -7, y: -7, w: 108, h: 48 })
  label = new Text('Button', TextStyles.BUTTONRobotoSmallCapRegular18WhiteCenter, { x: 13, y: 0, w: 70, h: 36 })
  constructor () {
    super('buttonContainerEnabled', 96, 36)
  }
}

export const buttonContainerEnabled = new buttonContainerEnabledClass()
