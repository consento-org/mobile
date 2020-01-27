// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Polygon, Text } from '../Component'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementLineSectionClass extends Component {
  bg: Polygon
  label: Text
  constructor () {
    super('elementLineSection', 375, 56)
    this.bg = new Polygon({ x: 0, y: 20, w: 375, h: 36 }, '#f7f7f7ff', null, [], this)
    this.label = new Text('Label', TextStyles.TITLERobotoSmallCapRegular12BlackLeft, { x: 15, y: 33, w: 240, h: 20 }, this)
  }
}

export const elementLineSection = new ElementLineSectionClass()
