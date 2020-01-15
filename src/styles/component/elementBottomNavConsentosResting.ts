// This file has been generated with expo-export@3.6.0, a Sketch plugin.
import { Component, ImagePlacement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementBottomNavConsentosRestingClass extends Component {
  icon: ImagePlacement
  title: Text
  constructor () {
    super('elementBottomNavConsentosResting', 98, 56)
    this.icon = new ImagePlacement(Asset.iconConsentoIdle, { x: 37, y: 8, w: 24, h: 24 }, this)
    this.title = new Text('Consentos', TextStyles.SubtitleRobotoRegular13BlackCenter, { x: 0, y: 37, w: 98, h: 16 }, this)
  }
}

export const elementBottomNavConsentosResting = new ElementBottomNavConsentosRestingClass()
