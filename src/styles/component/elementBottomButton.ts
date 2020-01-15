// This file has been generated with expo-export@3.6.0, a Sketch plugin.
import { Component, Link } from '../Component'
import { elementBottomFadeout } from './elementBottomFadeout'
import { buttonContainerLight } from './buttonContainerLight'

/* eslint-disable lines-between-class-members */
export class ElementBottomButtonClass extends Component {
  bottomArea = new Link(elementBottomFadeout, { x: 0, y: 0, w: 375, h: 100 }, {})
  button = new Link(buttonContainerLight, { x: 52.5, y: 32, w: 270, h: 36 }, {
    label: '+'
  })
  constructor () {
    super('elementBottomButton', 375, 100)
  }
}

export const elementBottomButton = new ElementBottomButtonClass()
