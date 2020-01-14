// This file has been generated with expo-export@3.5.2, a Sketch plugin.
import { Component, Text, ImagePlacement, Link } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { elementBottomButton } from './elementBottomButton'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementLocksEmptyClass extends Component {
  description: Text
  title: Text
  illustration: ImagePlacement
  bottomButton = new Link(elementBottomButton, { x: 0, y: 870, w: 375, h: 100 }, {
    buttonLabel: 'ADD'
  })
  constructor () {
    super('elementLocksEmpty', 375.0000000000001, 970, Color.lightGrey)
    this.description = new Text('Dummy text to explain that to lock the vault, you need one ‘lockee’ at least. \n\nAdditional dummy text to guide how to choose a ‘good’ lockee ; available, trustworhy, etc. \n\nAdditional dummy test to access the list of reliable professional trustees near you.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 52, y: 464, w: 270, h: 196 }, this)
    this.title = new Text('No lock yet…', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 84.5, y: 358, w: 206, h: 36 }, this)
    this.illustration = new ImagePlacement(Asset.illustrationLock, { x: 145.5, y: 271, w: 80, h: 80 }, this)
  }
}

export const elementLocksEmpty = new ElementLocksEmptyClass()
