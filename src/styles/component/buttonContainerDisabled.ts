// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Text } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

export class buttonContainerDisabledClass extends Component {
  shape = new Polygon({ x: 0, y: 0, w: 96, h: 36 }, null, 16, { 
    fill: Color.borderDark,
    thickness: 1,
    lineEnd: 'Butt'
  }, [])
  label = new Text('Button', TextStyles.BUTTONRobotoSmallCapRegular18BlackCenter, { x: 13, y: 0, w: 70, h: 36 })
  constructor () {
    super('buttonContainerDisabled', 96, 36)
  }
}

export const buttonContainerDisabled = new buttonContainerDisabledClass()
