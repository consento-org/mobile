// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Polygon, Text } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementLogLineClass extends Component {
  bg: Polygon
  time: Text
  text: Text
  constructor () {
    super('elementLogLine', 375, 98, Color.lightGrey)
    this.bg = new Polygon({ x: 0, y: 34, w: 375, h: 64 }, Color.grey, { radius: 5 }, [], this)
    this.time = new Text('02.10.2019', TextStyles.time, { x: 30, y: 0.5, w: 325, h: 33.5 }, this)
    this.text = new Text('Vault was created', TextStyles.BodyRobotoRegular18BlackLeft, { x: 30, y: 50, w: 325, h: 32 }, this)
  }
}

export const elementLogLine = new ElementLogLineClass()
