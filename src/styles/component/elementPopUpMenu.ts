// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Text } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'

/* eslint-disable lines-between-class-members */
export class ElementPopUpMenuClass extends Component {
  bg: Polygon
  buttonBg: Polygon
  cancel: Text
  bottomBg: Polygon
  disabled: Text
  createText: Text
  takePicture: Text
  topBg: Polygon
  separator: Polygon
  description: Text
  constructor () {
    super('elementPopUpMenu', 375, 812)
    this.bg = new Polygon({ x: 0, y: 0, w: 375, h: 812 }, '#00000066', null, [], this)
    this.buttonBg = new Polygon({ x: 10, y: 746, w: 355, h: 57 }, Color.white, { radius: 13 }, [], this)
    this.cancel = new Text('Cancel', {
      ...TextStyles.BodyRobotoRegular18BlueCenter,
      textAlignVertical: 'center'
    }, { x: 10, y: 746, w: 355, h: 57 }, this)
    this.bottomBg = new Polygon({ x: 10, y: 682, w: 355, h: 54 }, null, null, [], this)
    this.disabled = new Text('...', {
        color: '#a4aab3ff',
      fontSize: 20,
      textAlign: 'center',
      textTransform: 'none',
      textAlignVertical: 'center'
      }, { x: 10, y: 681.05, w: 355, h: 55 }, this)
    this.createText = new Text('Create text file', {
      ...TextStyles.BodyRobotoRegular18BlueCenter,
      textAlignVertical: 'center'
    }, { x: 10, y: 624, w: 355, h: 56.55 }, this)
    this.takePicture = new Text('Take picture', {
      ...TextStyles.BodyRobotoRegular18BlueCenter,
      textAlignVertical: 'center'
    }, { x: 6.5, y: 565, w: 358.5, h: 58.5 }, this)
    this.topBg = new Polygon({ x: 10, y: 521, w: 355, h: 45 }, null, { radius: 13 }, [], this)
    this.separator = new Polygon({ x: 10, y: 565, w: 355, h: 1 }, Color.darkGrey, null, [], this)
    this.description = new Text('Add data', {
      ...TextStyles.SubtitleRobotoRegular13GreyCenter,
      textAlignVertical: 'center'
    }, { x: 10, y: 521, w: 355, h: 44 }, this)
  }
}

export const elementPopUpMenu = new ElementPopUpMenuClass()
