// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, ImagePlacement } from '../Component'
import { Color } from '../Color'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class Screen01WelcomeClass extends Component {
  Oval = new Polygon({ x: 33.49, y: 9.65, w: 4, h: 4 }, '#e23e06ff', 0, null, [])
  elementLogo = new Polygon({ x: 0, y: 0, w: 104, h: 104 }, Color.white, 0, null, [])
  c = new Polygon({ x: 0, y: 0, w: 35, h: 41.65 }, '#e23e06ff', 0, null, [])
  Shape = new Polygon({ x: 0, y: 0, w: 3.84, h: 19.07 }, '#e23e06ff', 0, null, [])
  Path = new Polygon({ x: 173.19, y: 48.67, w: 6.26, h: 7.81 }, null, 0, null, [])
  OvalCopy = new Polygon({ x: 35.49, y: 14.65, w: 4, h: 4 }, '#e23e06ff', 0, null, [])
  OvalCopy2 = new Polygon({ x: 36.49, y: 20.65, w: 4, h: 4 }, '#e23e06ff', 0, null, [])
  elementWelcome: ImagePlacement
  constructor () {
    super('screen01Welcome', 375, 812, Color.coral)
    this.elementWelcome = new ImagePlacement(Asset.elementWelcome, { x: 77, y: 274.5, w: 217, h: 224.5 }, this)
  }
}

export const screen01Welcome = new Screen01WelcomeClass()
