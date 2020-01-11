// This file has been generated with expo-export, a Sketch plugin.
import { Component, Link } from '../Component'
import { elementBottomButton } from './elementBottomButton'
import { elementFormInputField } from './elementFormInputField'
import { buttonContainerDisabled } from './buttonContainerDisabled'
import { buttonContainerEnabled } from './buttonContainerEnabled'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementConfigClass extends Component {
  bottomButton = new Link(elementBottomButton, { x: 0, y: 870, w: 375, h: 100 }, {
    buttonLabel: 'Save Changes'
  })
  host = new Link(elementFormInputField, { x: 0, y: 18, w: 375, h: 85 }, {
    active: 'https://192.168.11.11',
    label: 'host',
    caption: 'during beta we need to connect to a server.'
  })
  reset1 = new Link(buttonContainerDisabled, { x: 25, y: 128, w: 180, h: 36 }, {
    label: 'reset'
  })
  reset2 = new Link(buttonContainerEnabled, { x: 25, y: 128, w: 180, h: 36 }, {
    label: 'RESET'
  })
  constructor () {
    super('elementConfig', 375, 970, Color.white)
  }
}

export const elementConfig = new ElementConfigClass()
