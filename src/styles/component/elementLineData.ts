// This file has been generated with expo-export, a Sketch plugin.
import { Component, Link, ImagePlacement, Text } from '../Component'
import { elementLineBorderIndented } from './elementLineBorderIndented'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementLineDataClass extends Component {
  separator = new Link(elementLineBorderIndented, { x: 0, y: 43, w: 375, h: 17 }, {})
  open: ImagePlacement
  menu: ImagePlacement
  label: Text
  constructor () {
    super('elementLineData', 375, 60, Color.white)
    this.open = new ImagePlacement(Asset.iconForwardGrey, { x: 315, y: 1, w: 60, h: 60 }, this)
    this.menu = new ImagePlacement(Asset.iconDotsHorizontal, { x: 260, y: 1, w: 55, h: 60 }, this)
    this.label = new Text('Label', {
      ...TextStyles.H6BlackHighEmphasisCenter,
      fontSize: 16,
      textAlign: 'left',
      textAlignVertical: 'center'
    }, { x: 15, y: 19, w: 245, h: 24 }, this)
  }
}

export const elementLineData = new ElementLineDataClass()
