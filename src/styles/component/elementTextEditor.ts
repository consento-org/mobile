// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Text, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementTextEditorClass extends Component {
  title: Text
  size: Text
  save: Text
  close: Text
  readable: Text
  closeSize: Polygon
  saveSize: Polygon
  constructor () {
    super('elementTextEditor', 375, 675, Color.white)
    this.title = new Text('Untitled', TextStyles.H5RobotoRegular24BlackLeft, { x: 15, y: 68, w: 344, h: 41.8 }, this)
    this.size = new Text('Size: 11 Ko', TextStyles.TimestampRobotoSmallCapRegular10BlackCenter, { x: 16, y: 106, w: 344, h: 24 }, this)
    this.save = new Text('Save', {
      ...TextStyles.BodyRobotoRegular18BlueLeft,
      textAlign: 'right'
    }, { x: 258, y: 41, w: 101, h: 24 }, this)
    this.close = new Text('Close', TextStyles.BodyRobotoRegular18BlueLeft, { x: 16, y: 41, w: 114, h: 24 }, this)
    this.readable = new Text('MyBank\n6178-25799\nAD870hJ72Oi\n\nBank of the World\nFJ&-3449-2998\n190287389202', TextStyles.BodyRobotoRegular18BlackLeft, { x: 15, y: 155, w: 344, h: 505 }, this)
    this.closeSize = new Polygon({ x: 0, y: 0, w: 129.5, h: 65 }, '#da552f1c', null, [], this)
    this.saveSize = new Polygon({ x: 258.5, y: 0, w: 116.5, h: 65 }, '#da552f1c', null, [], this)
  }
}

export const elementTextEditor = new ElementTextEditorClass()
