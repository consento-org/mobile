// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Text, ImagePlacement, Link } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Asset } from '../../Asset'
import { elementBottomButton } from './elementBottomButton'

/* eslint-disable lines-between-class-members */
export class ElementRelationNameClass extends Component {
  rectangle: Polygon
  caption: Text
  cutout: Polygon
  label: Text
  inactive: Text
  active: Text
  iconCrossGrey: ImagePlacement
  bottomButton = new Link(elementBottomButton, { x: 0, y: 870, w: 375, h: 100 }, {
    buttonLabel: 'Save Changes'
  })
  constructor () {
    super('elementRelationName', 375, 970, Color.white)
    this.rectangle = new Polygon({ x: 23, y: 23, w: 327.99, h: 56 }, null, {
      fill: '#cfd8dcff',
      thickness: 2,
      lineEnd: 'Butt',
      radius: 4
    }, [], this)
    this.caption = new Text('only you will see this nickname', TextStyles.CaptionPrimaryOnSurfaceLeft, { x: 39, y: 82, w: 312, h: 16 }, this)
    this.cutout = new Polygon({ x: 34, y: 13, w: 44, h: 17 }, Color.white, null, [], this)
    this.label = new Text('name', TextStyles.CaptionPrimaryOnSurfaceLeft, { x: 39, y: 14, w: 35, h: 16 }, this)
    this.inactive = new Text('A101-B202-C303-D404', {
      ...TextStyles.Subtitle1SelectedOnSurfaceHighEmphasisLeft,
      color: Color.darkGrey
    }, { x: 38.5, y: 39, w: 297, h: 24 }, this)
    this.active = new Text('Name', TextStyles.Subtitle1SelectedOnSurfaceHighEmphasisLeft, { x: 38.5, y: 39, w: 267.5, h: 24 }, this)
    this.iconCrossGrey = new ImagePlacement(Asset.iconCrossGrey, { x: 311.5, y: 39, w: 24, h: 24 }, this)
  }
}

export const elementRelationName = new ElementRelationNameClass()
