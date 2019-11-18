// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Text } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ButtonContainerEnabledClass extends Component {
  shape = new Polygon({ x: 0, y: 0, w: 96, h: 36 }, Color.coral, 16, null, [
    { x: 0, y: 1, blur: 3, spread: 0, color: '#00000033' },
    { x: 0, y: 2, blur: 1, spread: -1, color: Color.borderDark },
    { x: 0, y: 1, blur: 1, spread: 0, color: '#00000024' }
  ])
  Container = new Polygon({ x: 0, y: 0, w: 96, h: 36 }, '#fafafaff', 16, null, [
    { x: 0, y: 1, blur: 3, spread: 0, color: '#00000033' },
    { x: 0, y: 2, blur: 1, spread: -1, color: Color.borderDark },
    { x: 0, y: 1, blur: 1, spread: 0, color: '#00000024' }
  ])
  label: Text
  constructor () {
    super('buttonContainerEnabled', 96, 36)
    this.label = new Text('Button', TextStyles.BUTTONRobotoSmallCapRegular18WhiteCenter, { x: 13, y: 0, w: 70, h: 36 }, this)
  }
}

export const buttonContainerEnabled = new ButtonContainerEnabledClass()
