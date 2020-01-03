// This file has been generated with expo-export, a Sketch plugin.
import { Component, Link, Polygon, Text } from '../Component'
import { buttonContainerDisabled } from './buttonContainerDisabled'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementConsentosBaseExpiredClass extends Component {
  deleteButton = new Link(buttonContainerDisabled, { x: 80, y: 77.5, w: 180, h: 36 }, {
    label: 'delete'
  })
  line: Polygon
  state: Text
  constructor () {
    super('elementConsentosBaseExpired', 340, 114)
    this.line = new Polygon({ x: 122, y: 12, w: 96, h: 1 }, null, {
      fill: Color.darkGrey,
      thickness: 1,
      lineEnd: 'Butt'
    }, [], this)
    this.state = new Text('expired', TextStyles.H5RobotoRegular24GreyCenter, { x: 0, y: 30.5, w: 340, h: 36 }, this)
  }
}

export const elementConsentosBaseExpired = new ElementConsentosBaseExpiredClass()
