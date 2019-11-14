// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Text } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

export class elementLogLineClass extends Component {
  bg = new Polygon({ x: 0, y: 34, w: 375, h: 64 }, Color.grey, 5, null, [])
  time = new Text('02.10.2019', TextStyles.time, { x: 30, y: 0.5, w: 325, h: 33.5 })
  text = new Text('Vault was created', TextStyles.BodyRobotoRegular18BlackLeft, { x: 30, y: 50, w: 325, h: 32 })
  constructor () {
    super('elementLogLine', 375, 98, Color.lightGrey)
  }
}

export const elementLogLine = new elementLogLineClass()
