// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Link } from '../Component'
import { elementConsentosBase } from './elementConsentosBase'
import { elementConsentosBaseIdle } from './elementConsentosBaseIdle'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementConsentosAccessIdleClass extends Component {
  requestBase = new Link(elementConsentosBase, { x: 0, y: 0, w: 340, h: 280 }, {})
  state = new Link(elementConsentosBaseIdle, { x: 0, y: 152, w: 340, h: 114 }, {
    deleteButtonLabel: 'deny',
    allowButtonLabel: 'allow'
  })
  constructor () {
    super('elementConsentosAccessIdle', 340, 280, Color.black)
  }
}

export const elementConsentosAccessIdle = new ElementConsentosAccessIdleClass()
