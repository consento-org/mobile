// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Text, ImagePlacement, Link } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Asset } from '../../Asset'
import { elementBottomButton } from './elementBottomButton'

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
    this.description = new Text('In this MVP version of Consento,\nyou can upload pictures \nor create text file.  \nNo maximum file size. Your device will tell when it is full.\n\nNote: This is a MVP version.  Data will ONLY be stored here. When the app updates or resets, data willl be lost.', {
      ...TextStyles.BodyRobotoRegular18BlueCenter,
      color: Color.black
    }, { x: 52, y: 410, w: 270, h: 330 }, this)
    this.title = new Text('No data yet…', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 82, y: 358, w: 211, h: 36 }, this)
    this.illustration = new ImagePlacement(Asset.illustrationVault, { x: 145.5, y: 271, w: 80, h: 80 }, this)
  }
}

export const elementVaultEmpty = new ElementVaultEmptyClass()
