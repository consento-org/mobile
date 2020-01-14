// This file has been generated with expo-export@3.5.2, a Sketch plugin.
import { Component, Link, Polygon, Text } from '../Component'
import { buttonContainerDisabled } from './buttonContainerDisabled'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementConsentosBaseAcceptedClass extends Component {
  deleteButton = new Link(buttonContainerDisabled, { x: 80, y: 78, w: 180, h: 36 }, {
    label: 'delete'
  })
  line: Polygon
  state: Text
  constructor () {
    super('elementConsentosBaseAccepted', 340, 114)
    this.line = new Polygon({ x: 122, y: 10, w: 96, h: 1 }, null, {
      fill: Color.darkGrey,
      thickness: 1,
      lineEnd: 'Butt'
    }, [], this)
    this.state = new Text('accepted', TextStyles.H5RobotoRegular24GreenCenter, { x: 0, y: 31, w: 340, h: 36 }, this)
  }
}

export const elementConsentosBaseAccepted = new ElementConsentosBaseAcceptedClass()
