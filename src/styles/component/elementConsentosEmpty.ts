// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Text, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Asset } from '../../Asset'

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
    this.description = new Text('You don’t have any Consento request for the moment. ', {
      ...TextStyles.BodyRobotoRegular18BlueCenter,
      color: Color.black
    }, { x: 58, y: 410, w: 270, h: 56 }, this)
    this.title = new Text('All set up !', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 102, y: 358, w: 171, h: 36 }, this)
    this.illustration = new ImagePlacement(Asset.illustrationSun, { x: 79.5, y: 124, w: 217, h: 213 }, this)
  }
}

export const elementConsentosEmpty = new ElementConsentosEmptyClass()
