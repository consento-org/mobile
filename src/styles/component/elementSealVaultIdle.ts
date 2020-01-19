// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Link, Polygon } from '../Component'
import { buttonContainerDisabled } from './buttonContainerDisabled'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementSealVaultIdleClass extends Component {
  disabled = new Link(buttonContainerDisabled, { x: 90, y: 12, w: 180, h: 36 }, {
    label: 'lock'
  })
  borderBottom: Polygon
  constructor () {
    super('elementSealVaultIdle', 360, 60, Color.grey)
    this.borderBottom = new Polygon({ x: 0, y: 58.25, w: 360, h: 2 }, null, {
      fill: '#d9d9d9ff',
      thickness: 1,
      lineEnd: 'Butt'
    }, [], this)
  }
}

export const elementSealVaultIdle = new ElementSealVaultIdleClass()
