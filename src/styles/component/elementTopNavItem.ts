// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Text, AssetPlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

export class elementTopNavItemClass extends Component {
  borderTop = new Polygon({ x: 0, y: 58.25, w: 360, h: 2 }, null, { 
  fill: '#d9d9d9ff',
  thickness: 1,
  lineEnd: 'Butt'
})
  title = new Text('Vault Name', TextStyles.H5RobotoRegular24BlackCenter, { x: 52, y: 12, w: 214, h: 36 })
  actionB = new AssetPlacement(Asset.iconEditGrey, { x: 276, y: 18, w: 24, h: 24 })
  actionA = new AssetPlacement(Asset.iconDeleteGrey, { x: 318, y: 18, w: 24, h: 24 })
  back = new AssetPlacement(Asset.iconBackGrey, { x: 18, y: 18, w: 24, h: 24 })
  constructor () {
    super('elementTopNavItem', 360, 60, Color.grey)
  }
}

export const elementTopNavItem = new elementTopNavItemClass()
