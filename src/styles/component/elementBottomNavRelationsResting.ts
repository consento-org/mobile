// This file has been generated with expo-export, a Sketch plugin.
import { Component, ImagePlacement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementBottomNavRelationsRestingClass extends Component {
  icon: ImagePlacement
  title: Text
  constructor () {
    super('elementBottomNavRelationsResting', 98, 56)
    this.icon = new ImagePlacement(Asset.iconRelationsIdle, { x: 37, y: 8, w: 24, h: 24 }, this)
    this.title = new Text('Relations', TextStyles.SubtitleRobotoRegular13BlackCenter, { x: 0, y: 37, w: 98, h: 16 }, this)
  }
}

export const elementBottomNavRelationsResting = new ElementBottomNavRelationsRestingClass()
