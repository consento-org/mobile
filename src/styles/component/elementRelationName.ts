// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Text, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class ElementRelationNameClass extends Component {
  rectangle: Polygon
  caption: Text
  cutout: Polygon
  label: Text
  inactive: Text
  active: Text
  iconCrossGrey: ImagePlacement
  constructor () {
    super('elementRelationName', 386, 103, Color.white)
    this.rectangle = new Polygon({ x: 29, y: 18, w: 327.99, h: 56 }, null, {
      fill: '#cfd8dcff',
      thickness: 2,
      lineEnd: 'Butt',
      radius: 4
    }, [], this)
    this.caption = new Text('only you will see this nickname', TextStyles.CaptionPrimaryOnSurfaceLeft, { x: 45, y: 77, w: 312, h: 16 }, this)
    this.cutout = new Polygon({ x: 40, y: 8, w: 44, h: 17 }, Color.white, null, [], this)
    this.label = new Text('name', TextStyles.CaptionPrimaryOnSurfaceLeft, { x: 45, y: 9, w: 35, h: 16 }, this)
    this.inactive = new Text('A101-B202-C303-D404', {
      ...TextStyles.Subtitle1SelectedOnSurfaceHighEmphasisLeft,
      color: Color.darkGrey
    }, { x: 44.5, y: 34, w: 297, h: 24 }, this)
    this.active = new Text('Name', TextStyles.Subtitle1SelectedOnSurfaceHighEmphasisLeft, { x: 44.5, y: 34, w: 267.5, h: 24 }, this)
    this.iconCrossGrey = new ImagePlacement(Asset.iconCrossGrey, { x: 317.5, y: 34, w: 24, h: 24 }, this)
  }
}

export const elementRelationName = new ElementRelationNameClass()
