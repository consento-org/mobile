// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, Polygon, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class ElementVaultUnlockClass extends Component {
  waiting: Text
  inactive: Polygon
  active: Polygon
  illustrationWaiting: ImagePlacement
  constructor () {
    super('elementVaultUnlock', 375.0000000000001, 970, Color.darkGrey)
    this.waiting = new Text('waiting for consent', TextStyles.waiting, { x: 52.5, y: 552, w: 270, h: 60 }, this)
    this.inactive = new Polygon({ x: 52.5, y: 552, w: 270, h: 60 }, null, {
      fill: '#ffffff5e',
      thickness: 4,
      lineEnd: 'Round',
      radius: 14
    }, [], this)
    this.active = new Polygon({ x: 52.5, y: 552, w: 270, h: 60 }, null, {
      fill: Color.white,
      thickness: 4,
      lineEnd: 'Round'
    }, [], this)
    this.illustrationWaiting = new ImagePlacement(Asset.illustrationWaiting, { x: 73.5, y: 252, w: 228, h: 213 }, this)
  }
}

export const elementVaultUnlock = new ElementVaultUnlockClass()
