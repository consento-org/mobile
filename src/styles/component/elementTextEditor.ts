// This file has been generated with expo-export@3.6.0, a Sketch plugin.
import { Component, Text, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementTextEditorClass extends Component {
  title: Text
  size: Text
  edit: Text
  save: Text
  readable: Text
  saveSize: Polygon
  editSize: Polygon
  constructor () {
    super('elementTextEditor', 375, 675, Color.white)
    this.title = new Text('Untitled', TextStyles.H5RobotoRegular24BlackLeft, { x: 15, y: 68, w: 344, h: 41.8 }, this)
    this.size = new Text('Size: 11 Ko', TextStyles.TimestampRobotoSmallCapRegular10BlackCenter, { x: 16, y: 106, w: 344, h: 24 }, this)
    this.edit = new Text('Edit', TextStyles.BodyRobotoRegular18BlueLeft, { x: 297, y: 41, w: 62, h: 24 }, this)
    this.save = new Text('Save', TextStyles.BodyRobotoRegular18BlueLeft, { x: 15, y: 41, w: 62, h: 24 }, this)
    this.readable = new Text('MyBank\n6178-25799\nAD870hJ72Oi\n\nBank of the World\nFJ&-3449-2998\n190287389202', TextStyles.BodyRobotoRegular18BlackLeft, { x: 15, y: 155, w: 344, h: 505 }, this)
    this.saveSize = new Polygon({ x: 0, y: 0, w: 129.5, h: 65 }, '#da552f1c', null, [], this)
    this.editSize = new Polygon({ x: 245.5, y: 0, w: 129.5, h: 65 }, '#da552f1c', null, [], this)
  }
}

export const elementTextEditor = new ElementTextEditorClass()
