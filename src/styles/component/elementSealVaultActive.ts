// This file has been generated with expo-export, a Sketch plugin.
import { Component, Link, Polygon } from '../Component'
import { buttonContainerEnabled } from './buttonContainerEnabled'

export class elementSealVaultActiveClass extends Component {
  enabled = new Link(buttonContainerEnabled, { x: 90, y: 12, w: 180, h: 36 })
  borderBottom = new Polygon({ x: 0, y: 58.25, w: 360, h: 2 }, null, 0, { 
    fill: '#d9d9d9ff',
    thickness: 1,
    lineEnd: 'Butt'
  }, [])
  constructor () {
    super('elementSealVaultActive', 360, 60)
  }
}

export const elementSealVaultActive = new elementSealVaultActiveClass()
