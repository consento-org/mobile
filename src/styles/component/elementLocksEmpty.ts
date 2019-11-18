// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

export class elementLocksEmptyClass extends Component {
  description: Text
  title: Text
  illustration: ImagePlacement
  constructor () {
    super('elementLocksEmpty', 375.0000000000001, 970, Color.lightGrey)
    this.description = new Text('Dummy text to explain that to lock the vault, you need one ‘lockee’ at least. \n\nAdditional dummy text to guide how to choose a ‘good’ lockee ; available, trustworhy, etc. \n\nAdditional dummy test to access the list of reliable professional trustees near you.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 52, y: 464, w: 270, h: 196 }, this)
    this.title = new Text('No lock yet…', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 84.5, y: 358, w: 206, h: 36 }, this)
    this.illustration = new ImagePlacement(Asset.illustrationLock, { x: 145.5, y: 271, w: 80, h: 80 }, this)
  }
}

export const elementLocksEmpty = new elementLocksEmptyClass()
