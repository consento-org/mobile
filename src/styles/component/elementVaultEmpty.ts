// This file has been generated with expo-export@3.6.0, a Sketch plugin.
import { Component, Text, ImagePlacement, Link } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { elementBottomButton } from './elementBottomButton'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementVaultEmptyClass extends Component {
  description: Text
  title: Text
  illustration: ImagePlacement
  bottomButton = new Link(elementBottomButton, { x: 0, y: 870, w: 375, h: 100 }, {
    buttonLabel: 'ADD'
  })
  constructor () {
    super('elementVaultEmpty', 375.0000000000001, 970, Color.lightGrey)
    this.description = new Text('Dummy text to explain what kinds of data can be added, or what maximum size.\n\nAdditioanl text to explain where will the data be stored encrypted, and backup encrypted.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 52, y: 464, w: 270, h: 196 }, this)
    this.title = new Text('No data yet…', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 82, y: 358, w: 211, h: 36 }, this)
    this.illustration = new ImagePlacement(Asset.illustrationVault, { x: 145.5, y: 271, w: 80, h: 80 }, this)
  }
}

export const elementVaultEmpty = new ElementVaultEmptyClass()
