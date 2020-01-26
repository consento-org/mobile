// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Text, Link } from '../Component'
import { TextStyles } from '../TextStyles'
import { buttonContainerLight } from './buttonContainerLight'
import { buttonContainerDisabled } from './buttonContainerDisabled'

/* eslint-disable lines-between-class-members */
export class ElementConsentosBaseIdleClass extends Component {
  timeLeft: Text
  allowButton = new Link(buttonContainerLight, { x: 80, y: 31, w: 180, h: 36 }, {
    label: 'allow'
  })
  deleteButton = new Link(buttonContainerDisabled, { x: 80, y: 78, w: 180, h: 36 }, {
    label: 'deny'
  })
  constructor () {
    super('elementConsentosBaseIdle', 340, 114)
    this.timeLeft = new Text('4:55 MINUTES LEFT', TextStyles.TimestampRobotoSmallCapRegular10RedCenter, { x: 0, y: 0, w: 340, h: 24 }, this)
  }
}

export const elementConsentosBaseIdle = new ElementConsentosBaseIdleClass()
