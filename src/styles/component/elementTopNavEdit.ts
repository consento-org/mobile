// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Polygon, Text, ImagePlacement } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class ElementTopNavEditClass extends Component {
  borderTop: Polygon
  background: Polygon
  underline: Polygon
  title: Text
  backCopy: ImagePlacement
  delete: ImagePlacement
  constructor () {
    super('elementTopNavEdit', 360, 60, Color.grey)
    this.borderTop = new Polygon({ x: 0, y: 58.25, w: 360, h: 2 }, null, {
      fill: '#d9d9d9ff',
      thickness: 1,
      lineEnd: 'Butt'
    }, [], this)
    this.background = new Polygon({ x: 52, y: 12, w: 259, h: 36 }, Color.white, null, [], this)
    this.underline = new Polygon({ x: 52, y: 47.25, w: 259, h: 2 }, null, {
      fill: Color.coral,
      thickness: 1,
      lineEnd: 'Butt'
    }, [], this)
    this.title = new Text('Vault Name', TextStyles.H5RobotoRegular24BlackCenter, { x: 52, y: 12, w: 259, h: 36 }, this)
    this.backCopy = new ImagePlacement(Asset.iconBackGrey, { x: 0, y: -0.5, w: 60, h: 60 }, this)
    this.delete = new ImagePlacement(Asset.iconDeleteGrey, { x: 304, y: 6, w: 48, h: 48 }, this)
  }
}

export const elementTopNavEdit = new ElementTopNavEditClass()
