// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementRelationsEmptyClass extends Component {
  description: Text
  title: Text
  illustration: ImagePlacement
  constructor () {
    super('elementRelationsEmpty', 375.0000000000001, 970, Color.lightGrey)
    this.description = new Text('Dummy text to explain that here will be displayed the Consento requests.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 58, y: 524, w: 270, h: 84 }, this)
    this.title = new Text('Add relations !', {
      ...TextStyles.H2PalanquinDarkMedium36BlackCenter,
      textAlignVertical: 'top'
    }, { x: 68.5, y: 418, w: 238, h: 36 }, this)
    this.illustration = new ImagePlacement(Asset.illustrationFriends, { x: 26.89, y: 227, w: 321.2, h: 178 }, this)
  }
}

export const elementRelationsEmpty = new ElementRelationsEmptyClass()
