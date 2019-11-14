// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

export class elementConsentosEmptyClass extends Component {
  lastUpdate = new Text('Last update: 2 seconds ago', TextStyles.H6BlackHighEmphasisCenter, { x: 92, y: 581, w: 202, h: 24 })
  description = new Text('Dummy text to explain that here will be displayed the Consento requests.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 58, y: 464, w: 270, h: 84 })
  title = new Text('All set up !', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 102, y: 358, w: 171, h: 36 })
  illustration = new ImagePlacement(Asset.illustrationSun, { x: 79.5, y: 154, w: 217, h: 213 })
  constructor () {
    super('elementConsentosEmpty', 375.0000000000001, 970, Color.lightGrey)
  }
}

export const elementConsentosEmpty = new elementConsentosEmptyClass()
