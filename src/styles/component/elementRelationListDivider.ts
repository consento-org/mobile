// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementRelationListDividerClass extends Component {
  label: Text
  divider = new Polygon({ x: 58, y: 15, w: 268.71, h: 1 }, null, {
    fill: Color.activeGrey,
    thickness: 1,
    lineEnd: 'Butt'
  }, [])
  constructor () {
    super('elementRelationListDivider', 375, 37)
    this.label = new Text('Y', TextStyles.LineDivider, { x: 27, y: 0, w: 25, h: 30 }, this)
  }
}

export const elementRelationListDivider = new ElementRelationListDividerClass()
