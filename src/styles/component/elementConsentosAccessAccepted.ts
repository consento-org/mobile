// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Link } from '../Component'
import { elementConsentosBase } from './elementConsentosBase'
import { elementConsentosBaseAccepted } from './elementConsentosBaseAccepted'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementConsentosAccessAcceptedClass extends Component {
  requestBase = new Link(elementConsentosBase, { x: 0, y: 0, w: 340, h: 280 }, {})
  state = new Link(elementConsentosBaseAccepted, { x: 0, y: 152, w: 340, h: 114 }, {
    deleteButtonLabel: 'delete'
  })
  constructor () {
    super('elementConsentosAccessAccepted', 340, 280, Color.black)
  }
}

export const elementConsentosAccessAccepted = new ElementConsentosAccessAcceptedClass()
