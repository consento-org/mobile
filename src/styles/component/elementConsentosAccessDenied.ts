// This file has been generated with expo-export@3.5.2, a Sketch plugin.
import { Component, Link } from '../Component'
import { elementConsentosBase } from './elementConsentosBase'
import { elementConsentosBaseDenied } from './elementConsentosBaseDenied'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementConsentosAccessDeniedClass extends Component {
  requestBase = new Link(elementConsentosBase, { x: 0, y: 0, w: 340, h: 270 }, {})
  state = new Link(elementConsentosBaseDenied, { x: 0, y: 142.5, w: 340, h: 114 }, {
    deleteButtonLabel: 'delete'
  })
  constructor () {
    super('elementConsentosAccessDenied', 340, 270, Color.black)
  }
}

export const elementConsentosAccessDenied = new ElementConsentosAccessDeniedClass()
