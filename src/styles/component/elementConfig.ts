// This file has been generated with expo-export, a Sketch plugin.
import { Component, Link } from '../Component'
import { elementBottomButton } from './elementBottomButton'
import { elementFormInputField } from './elementFormInputField'
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
  constructor () {
    super('elementConfig', 375, 970, Color.white)
  }
}

export const elementConfig = new ElementConfigClass()
