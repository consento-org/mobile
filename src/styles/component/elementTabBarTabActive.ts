// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementTabBarTabActiveClass extends Component {
  label: Text
  bottomLine = new Polygon({ x: -0.25, y: 47, w: 99, h: 2 }, null, {
    fill: Color.activeGrey,
    thickness: 2,
    lineEnd: 'Butt'
  }, [])
  constructor () {
    super('elementTabBarTabActive', 98, 48, Color.grey)
    this.label = new Text('Label', {
      ... TextStyles.SubtitleRobotoBold13BlackCenter,
      textTransform: 'uppercase',
      textAlignVertical: 'center'
    }, { x: 0, y: 0, w: 98, h: 48 }, this)
  }
}

export const elementTabBarTabActive = new ElementTabBarTabActiveClass()
