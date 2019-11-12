// This file has been generated with expo-export, a Sketch plugin.
import { Component, ImagePlacement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

export class elementBottomNavConsentosActiveClass extends Component {
  icon = new ImagePlacement(Asset.iconConsentoActive, { x: 37, y: 8, w: 24, h: 24 })
  title = new Text('Consentos', TextStyles.SubtitleRobotoBold13BlackCenter, { x: 0, y: 37, w: 98, h: 16 })
  constructor () {
    super('elementBottomNavConsentosActive', 98, 56)
  }
}

export const elementBottomNavConsentosActive = new elementBottomNavConsentosActiveClass()
