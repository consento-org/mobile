// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

export class elementTabBarTabRestingClass extends Component {
  label = new Text('Label', TextStyles.SubtitleRobotoRegular13BlackCenter, { x: 0, y: 0, w: 98, h: 48 })
  effect = new Polygon({ x: 64, y: 4, w: 34, h: 32 }, Color.activeGrey, 0, null, [])
  constructor () {
    super('elementTabBarTabResting', 98, 48, Color.grey)
  }
}

export const elementTabBarTabResting = new elementTabBarTabRestingClass()
