// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, ImagePlacement, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

export class elementTopNavEmptyClass extends Component {
  title: Text
  logo: ImagePlacement
  borderTop = new Polygon({ x: 0, y: 58.25, w: 360, h: 2 }, null, 0, { 
    fill: '#d9d9d9ff',
    thickness: 1,
    lineEnd: 'Butt'
  }, [])
  constructor () {
    super('elementTopNavEmpty', 360, 60, Color.grey)
    this.title = new Text('Vaults', TextStyles.H5RobotoRegular24BlackCenter, { x: 55, y: 12, w: 250, h: 36 }, this)
    this.logo = new ImagePlacement(Asset.iconLogo, { x: 9.5, y: 11, w: 38.35, h: 38 }, this)
  }
}

export const elementTopNavEmpty = new elementTopNavEmptyClass()
