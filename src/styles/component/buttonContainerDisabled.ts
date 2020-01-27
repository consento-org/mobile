// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Polygon, Text } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ButtonContainerDisabledClass extends Component {
  shape: Polygon
  label: Text
  constructor () {
    super('buttonContainerDisabled', 96, 36)
    this.shape = new Polygon({ x: 0, y: 0, w: 96, h: 36 }, null, {
      fill: Color.borderDark,
      thickness: 1,
      lineEnd: 'Butt',
      radius: 16
    }, [], this)
    this.label = new Text('Button', TextStyles.BUTTONRobotoSmallCapRegular18BlackCenter, { x: 13, y: 0, w: 70, h: 36 }, this)
  }
}

export const buttonContainerDisabled = new ButtonContainerDisabledClass()
