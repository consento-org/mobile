// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Text, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Asset } from '../../Asset'

/* eslint-disable lines-between-class-members */
export class ElementVaultsEmptyClass extends Component {
  description: Text
  title: Text
  illustration: ImagePlacement
  constructor () {
    super('elementVaultsEmpty', 375.0000000000001, 970, Color.lightGrey)
    this.description = new Text('You have no vault yet. \n\nJust press the + button down there, and start encrypting files.', {
      ...TextStyles.BodyRobotoRegular18BlueCenter,
      color: Color.black
    }, { x: 58, y: 464, w: 270, h: 330 }, this)
    this.title = new Text('Create vaults !', {
      ...TextStyles.H2PalanquinDarkMedium36BlackCenter,
      textAlignVertical: 'top'
    }, { x: 72, y: 408, w: 232, h: 36 }, this)
    this.illustration = new ImagePlacement(Asset.illustrationVaults, { x: 26.89, y: 210, w: 321, h: 178 }, this)
  }
}

export const elementVaultsEmpty = new ElementVaultsEmptyClass()
