// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Polygon, Text } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementConsentosBaseConfirmingClass extends Component {
  line: Polygon
  state: Text
  constructor () {
    super('elementConsentosBaseConfirming', 340, 114)
    this.line = new Polygon({ x: 122, y: 12, w: 96, h: 1 }, null, {
      fill: Color.darkGrey,
      thickness: 1,
      lineEnd: 'Butt'
    }, [], this)
    this.state = new Text('confirming…', TextStyles.H5RobotoRegular24GreyCenter, { x: 0, y: 30.5, w: 340, h: 36 }, this)
  }
}

export const elementConsentosBaseConfirming = new ElementConsentosBaseConfirmingClass()
