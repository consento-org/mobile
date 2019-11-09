// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, AssetPlacement, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

export class elementTopNavEmptyClass extends Component {
  title = new Text('Vaults', TextStyles.H5RobotoRegular24BlackCenter, { x: 55, y: 12, w: 250, h: 36 })
  logo = new AssetPlacement(Asset.iconLogo, { x: 9.5, y: 11, w: 38.35, h: 38 })
  borderTop = new Polygon({ x: 0, y: 58.25, w: 360, h: 2 }, null, { 
  fill: '#d9d9d9ff',
  thickness: 1,
  lineEnd: 'Butt'
})
  constructor () {
    super('elementTopNavEmpty', 360, 60, Color.grey)
  }
}

export const elementTopNavEmpty = new elementTopNavEmptyClass()
