// This file has been generated with expo-export@3.5.2, a Sketch plugin.
import { Component, Link } from '../Component'
import { elementConsentosAccessAccepted } from './elementConsentosAccessAccepted'
import { elementConsentosAccessExpired } from './elementConsentosAccessExpired'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class Screen02ConsentosClass extends Component {
  a = new Link(elementConsentosAccessAccepted, { x: 17.5, y: 119, w: 340, h: 270 }, {
    stateDeleteButtonLabel: 'delete'
  })
  b = new Link(elementConsentosAccessExpired, { x: 17.5, y: 406, w: 340, h: 270 }, {
    stateDeleteButtonLabel: 'delete'
  })
  constructor () {
    super('screen02Consentos', 375, 812, Color.mediumGrey)
  }
}

export const screen02Consentos = new Screen02ConsentosClass()
