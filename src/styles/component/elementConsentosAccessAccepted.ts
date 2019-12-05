// This file has been generated with expo-export, a Sketch plugin.
import { Component, Link, Polygon, Text } from '../Component'
import { elementConsentosBase } from './elementConsentosBase'
import { buttonContainerDisabled } from './buttonContainerDisabled'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementConsentosAccessAcceptedClass extends Component {
  requestBase = new Link(elementConsentosBase, { x: 0, y: 0, w: 340, h: 270 }, {})
  deleteButton = new Link(buttonContainerDisabled, { x: 80, y: 220, w: 180, h: 36 }, {
    label: 'delete'
  })
  line = new Polygon({ x: 122, y: 152, w: 96, h: 1 }, null, {
    fill: Color.darkGrey,
    thickness: 1,
    lineEnd: 'Butt'
  }, [])
  state: Text
  constructor () {
    super('elementConsentosAccessAccepted', 340, 270, Color.black)
    this.state = new Text('accepted', TextStyles.H5RobotoRegular24GreenCenter, { x: 0, y: 173, w: 340, h: 36 }, this)
  }
}

export const elementConsentosAccessAccepted = new ElementConsentosAccessAcceptedClass()
