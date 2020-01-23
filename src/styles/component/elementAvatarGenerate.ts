// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Text, ImagePlacement, Polygon } from '../Component'
import { Asset } from '../../Asset'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementAvatarGenerateClass extends Component {
  label: Text
  placeholder: ImagePlacement
  avatar: Polygon
  crossIcon: ImagePlacement
  crossToucharea: Polygon
  constructor () {
    super('elementAvatarGenerate', 239, 210)
    this.label = new Text('Generate Avatar', {
      color: '#546e7aff',
      fontSize: 14.14,
      textAlign: 'center',
      textTransform: 'uppercase',
      textAlignVertical: 'top'
    }, { x: 45, y: 159, w: 150, h: 26 }, this)
    this.placeholder = new ImagePlacement(Asset.iconAvatarPlaceholder, { x: 55.5, y: 22.5, w: 128, h: 128 }, this)
    this.avatar = new Polygon({ x: 58.5, y: 25.5, w: 122, h: 122 }, Color.coral, null, [], this)
    this.crossIcon = new ImagePlacement(Asset.iconCrossGrey, { x: 205, y: 9.5, w: 24, h: 24 }, this)
    this.crossToucharea = new Polygon({ x: 195, y: 0, w: 44, h: 43 }, Color.coral, null, [], this)
  }
}

export const elementAvatarGenerate = new ElementAvatarGenerateClass()
