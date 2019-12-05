// This file has been generated with expo-export, a Sketch plugin.
import { Component, Link, Text } from '../Component'
import { elementConsentosBase } from './elementConsentosBase'
import { buttonContainerDisabled } from './buttonContainerDisabled'
import { TextStyles } from '../TextStyles'
import { buttonContainerLight } from './buttonContainerLight'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementConsentosAccessIdleClass extends Component {
  requestBase = new Link(elementConsentosBase, { x: 0, y: 0, w: 340, h: 270 }, {})
  deleteButton = new Link(buttonContainerDisabled, { x: 80, y: 220, w: 180, h: 36 }, {
    label: 'DENY'
  })
  timeLeft: Text
  allowButton = new Link(buttonContainerLight, { x: 80, y: 173, w: 180, h: 36 }, {
    label: 'allow'
  })
  constructor () {
    super('elementConsentosAccessIdle', 340, 270, Color.black)
    this.timeLeft = new Text('4:55 MINUTES LEFT', TextStyles.TimestampRobotoSmallCapRegular10RedCenter, { x: 0, y: 142, w: 340, h: 24 }, this)
  }
}

export const elementConsentosAccessIdle = new ElementConsentosAccessIdleClass()
