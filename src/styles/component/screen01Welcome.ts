// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, ImagePlacement } from '../Component'
import { Asset } from '../../Asset'
import { Color } from '../Color'

export class screen01WelcomeClass extends Component {
  c = new Polygon({ x: 0, y: 0, w: 35, h: 41.65 }, '#e23e06ff', 0, null, [])
  Shape = new Polygon({ x: 0, y: 0, w: 3.84, h: 19.07 }, '#e23e06ff', 0, null, [])
  Path = new Polygon({ x: 173.19, y: 48.67, w: 6.26, h: 7.81 }, null, 0, null, [])
  elementWelcome = new ImagePlacement(Asset.elementWelcome, { x: 77, y: 274.5, w: 217, h: 224.5 })
  constructor () {
    super('screen01Welcome', 375, 812, Color.coral)
  }
}

export const screen01Welcome = new screen01WelcomeClass()
