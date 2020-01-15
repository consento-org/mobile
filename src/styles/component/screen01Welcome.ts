// This file has been generated with expo-export@3.6.0, a Sketch plugin.
import { Component, ImagePlacement } from '../Component'
import { Asset } from '../../Asset'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class Screen01WelcomeClass extends Component {
  illustration: ImagePlacement
  constructor () {
    super('screen01Welcome', 375, 812, Color.coral)
    this.illustration = new ImagePlacement(Asset.illustrationWelcome, { x: 78.85, y: 276, w: 216, h: 224 }, this)
  }
}

export const screen01Welcome = new Screen01WelcomeClass()
