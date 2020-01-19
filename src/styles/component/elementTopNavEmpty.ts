// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Text, ImagePlacement, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementTopNavEmptyClass extends Component {
  title: Text
  logo: ImagePlacement
  borderTop: Polygon
  constructor () {
    super('elementTopNavEmpty', 360, 60, Color.grey)
    this.title = new Text('Vaults', TextStyles.H5RobotoRegular24BlackCenter, { x: 55, y: 12, w: 250, h: 36 }, this)
    this.logo = new ImagePlacement(Asset.iconLogo, { x: 9.5, y: 11, w: 38.35, h: 38 }, this)
    this.borderTop = new Polygon({ x: 0, y: 58.25, w: 360, h: 2 }, null, {
      fill: '#d9d9d9ff',
      thickness: 1,
      lineEnd: 'Butt'
    }, [], this)
  }
}

export const elementTopNavEmpty = new ElementTopNavEmptyClass()
