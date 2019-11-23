// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, Polygon, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class ElementVaultUnlockClass extends Component {
  waiting: Text
  inactive = new Polygon({ x: 52.5, y: 552, w: 270, h: 60 }, null, 14, {
    fill: '#ffffff5e',
    thickness: 4,
    lineEnd: 'Round'
  }, [])
  active = new Polygon({ x: 52.5, y: 552, w: 270, h: 60 }, null, 0, {
    fill: Color.white,
    thickness: 4,
    lineEnd: 'Round'
  }, [])
  illustrationWaiting: ImagePlacement
  constructor () {
    super('elementVaultUnlock', 375.0000000000001, 970, Color.darkGrey)
    this.waiting = new Text('waiting for consent', TextStyles.waiting, { x: 52.5, y: 552, w: 270, h: 60 }, this)
    this.illustrationWaiting = new ImagePlacement(Asset.illustrationWaiting, { x: 73.5, y: 252, w: 228, h: 213 }, this)
  }
}

export const elementVaultUnlock = new ElementVaultUnlockClass()
