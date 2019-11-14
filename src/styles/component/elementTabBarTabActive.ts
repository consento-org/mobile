// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

export class elementTabBarTabActiveClass extends Component {
  label = new Text('Label', TextStyles.SubtitleRobotoBold13BlackCenter, { x: 0, y: 0, w: 98, h: 48 })
  bottomLine = new Polygon({ x: -0.25, y: 47, w: 99, h: 2 }, null, 0, { 
    fill: Color.activeGrey,
    thickness: 2,
    lineEnd: 'Butt'
  }, [])
  constructor () {
    super('elementTabBarTabActive', 98, 48, Color.grey)
  }
}

export const elementTabBarTabActive = new elementTabBarTabActiveClass()
