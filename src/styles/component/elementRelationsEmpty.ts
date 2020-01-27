// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Text, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class ElementRelationsEmptyClass extends Component {
  description: Text
  title: Text
  illustration: ImagePlacement
  constructor () {
    super('elementRelationsEmpty', 375.0000000000001, 970, Color.lightGrey)
    this.description = new Text('Just press the + button and scan the QRcode of a Consento user’s device.\n\nYou can name that person as you whis, only you will know it.\n\nYou and that person could then add each other as lockee of your vaults.', {
      ...TextStyles.BodyRobotoRegular18BlueCenter,
      color: Color.black
    }, { x: 58, y: 464, w: 270, h: 330 }, this)
    this.title = new Text('Add relations !', {
      ...TextStyles.H2PalanquinDarkMedium36BlackCenter,
      textAlignVertical: 'top'
    }, { x: 69, y: 408, w: 238, h: 36 }, this)
    this.illustration = new ImagePlacement(Asset.illustrationFriends, { x: 26.89, y: 210, w: 321.2, h: 178 }, this)
  }
}

export const elementRelationsEmpty = new ElementRelationsEmptyClass()
