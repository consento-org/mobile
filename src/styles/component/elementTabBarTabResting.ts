// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Text, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementTabBarTabRestingClass extends Component {
  label: Text
  effect: Polygon
  constructor () {
    super('elementTabBarTabResting', 98, 48, Color.grey)
    this.label = new Text('Label', {
      ...TextStyles.SubtitleRobotoRegular13BlackCenter,
      textTransform: 'uppercase',
      textAlignVertical: 'center'
    }, { x: 0, y: 0, w: 98, h: 48 }, this)
    this.effect = new Polygon({ x: 64, y: 4, w: 34, h: 32 }, Color.white, null, [], this)
  }
}

export const elementTabBarTabResting = new ElementTabBarTabRestingClass()
