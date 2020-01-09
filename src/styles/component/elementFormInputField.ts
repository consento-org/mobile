// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Text, ImagePlacement } from '../Component'
import { Color } from '../Color'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class ElementFormInputFieldClass extends Component {
  invalid: Polygon
  rectangle: Polygon
  caption: Text
  cutout: Polygon
  label: Text
  inactive: Text
  active: Text
  reset: ImagePlacement
  constructor () {
    super('elementFormInputField', 375, 85)
    this.invalid = new Polygon({ x: 20, y: 10, w: 327.99, h: 56 }, null, {
      fill: Color.red,
      thickness: 2,
      lineEnd: 'Butt',
      radius: 4
    }, [], this)
    this.rectangle = new Polygon({ x: 20, y: 10, w: 327.99, h: 56 }, null, {
      fill: '#cfd8dcff',
      thickness: 2,
      lineEnd: 'Butt',
      radius: 4
    }, [], this)
    this.caption = new Text('description', TextStyles.CaptionPrimaryOnSurfaceLeft, { x: 35.99, y: 69, w: 312, h: 16 }, this)
    this.cutout = new Polygon({ x: 30.99, y: 0, w: 44, h: 17 }, Color.white, null, [], this)
    this.label = new Text('label', {
      ...TextStyles.CaptionPrimaryOnSurfaceLeft,
      textAlign: 'center'
    }, { x: 31, y: 1, w: 44, h: 16 }, this)
    this.inactive = new Text('Inactive', {
      ...TextStyles.Subtitle1SelectedOnSurfaceHighEmphasisLeft,
      color: Color.darkGrey
    }, { x: 35.49, y: 26, w: 297, h: 24 }, this)
    this.active = new Text('Active', TextStyles.Subtitle1SelectedOnSurfaceHighEmphasisLeft, { x: 35.49, y: 26, w: 267.5, h: 24 }, this)
    this.reset = new ImagePlacement(Asset.iconCrossGrey, { x: 308.49, y: 26, w: 24, h: 24 }, this)
  }
}

export const elementFormInputField = new ElementFormInputFieldClass()
