// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Text, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementConsentosEmptyClass extends Component {
  lastUpdate: Text
  description: Text
  title: Text
  illustration: ImagePlacement
  constructor () {
    super('elementConsentosEmpty', 375.0000000000001, 970, Color.lightGrey)
    this.lastUpdate = new Text('Last update: 2 seconds ago', {
      ...TextStyles.H6BlackHighEmphasisCenter,
      color: '#7c8792ff',
      fontSize: 13,
      textAlignVertical: 'center'
    }, { x: 92, y: 581, w: 202, h: 24 }, this)
    this.description = new Text('Dummy text to explain that here will be displayed the Consento requests.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 58, y: 464, w: 270, h: 84 }, this)
    this.title = new Text('All set up !', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 102, y: 358, w: 171, h: 36 }, this)
    this.illustration = new ImagePlacement(Asset.illustrationSun, { x: 79.5, y: 154, w: 217, h: 213 }, this)
  }
}

export const elementConsentosEmpty = new ElementConsentosEmptyClass()
