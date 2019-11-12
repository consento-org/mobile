// This file has been generated with expo-export, a Sketch plugin.
import { Component, Link, Polygon } from '../Component'
import { buttonContainerDisabled } from './buttonContainerDisabled'

export class elementSealVaultIdleClass extends Component {
  disabled = new Link(buttonContainerDisabled, { x: 90, y: 12, w: 180, h: 36 })
  borderBottom = new Polygon({ x: 0, y: 58.25, w: 360, h: 2 }, null, 0, { 
    fill: '#d9d9d9ff',
    thickness: 1,
    lineEnd: 'Butt'
  }, [])
  constructor () {
    super('elementSealVaultIdle', 360, 60)
  }
}

export const elementSealVaultIdle = new elementSealVaultIdleClass()
