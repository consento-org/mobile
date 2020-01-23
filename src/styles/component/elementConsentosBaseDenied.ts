// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Polygon, Text, Link } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'
import { buttonContainerDisabled } from './buttonContainerDisabled'

/* eslint-disable lines-between-class-members */
export class ElementConsentosBaseDeniedClass extends Component {
  line: Polygon
  state: Text
  deleteButton = new Link(buttonContainerDisabled, { x: 80, y: 78, w: 180, h: 36 }, {
    label: 'delete'
  })
  constructor () {
    super('elementConsentosBaseDenied', 340, 114)
    this.line = new Polygon({ x: 122, y: 12, w: 96, h: 1 }, null, {
      fill: Color.darkGrey,
      thickness: 1,
      lineEnd: 'Butt'
    }, [], this)
    this.state = new Text('denied', TextStyles.H5RobotoRegular24RedCenter, { x: 0, y: 30.5, w: 340, h: 36 }, this)
  }
}

export const elementConsentosBaseDenied = new ElementConsentosBaseDeniedClass()
