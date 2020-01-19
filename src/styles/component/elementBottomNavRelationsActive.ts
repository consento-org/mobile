// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, ImagePlacement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementBottomNavRelationsActiveClass extends Component {
  icon: ImagePlacement
  title: Text
  constructor () {
    super('elementBottomNavRelationsActive', 98, 56)
    this.icon = new ImagePlacement(Asset.iconRelationsActive, { x: 37, y: 8, w: 24, h: 24 }, this)
    this.title = new Text('Relations', TextStyles.SubtitleRobotoBold13BlackCenter, { x: 0, y: 37, w: 98, h: 16 }, this)
  }
}

export const elementBottomNavRelationsActive = new ElementBottomNavRelationsActiveClass()
