// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Text, ImagePlacement } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class ElementTopNavEditClass extends Component {
  borderTop = new Polygon({ x: 0, y: 58.25, w: 360, h: 2 }, null, 0, {
    fill: '#d9d9d9ff',
    thickness: 1,
    lineEnd: 'Butt'
  }, [])
  background = new Polygon({ x: 52, y: 12, w: 259, h: 36 }, Color.white, 0, null, [])
  underline = new Polygon({ x: 52, y: 47.25, w: 259, h: 2 }, null, 0, {
    fill: Color.coral,
    thickness: 1,
    lineEnd: 'Butt'
  }, [])
  title: Text
  delete: ImagePlacement
  back: ImagePlacement
  constructor () {
    super('elementTopNavEdit', 360, 60, Color.grey)
    this.title = new Text('Vault Name', TextStyles.H5RobotoRegular24BlackCenter, { x: 52, y: 12, w: 259, h: 36 }, this)
    this.delete = new ImagePlacement(Asset.iconDeleteGrey, { x: 318, y: 18, w: 24, h: 24 }, this)
    this.back = new ImagePlacement(Asset.iconBackGrey, { x: 18, y: 18, w: 24, h: 24 }, this)
  }
}

export const elementTopNavEdit = new ElementTopNavEditClass()
