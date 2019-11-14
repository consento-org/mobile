// This file has been generated with expo-export, a Sketch plugin.
import { Component, Text, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { Asset } from '../../Asset'
import { Color } from '../Color'

export class elementVaultEmptyClass extends Component {
  description = new Text('Dummy text to explain what kinds of data can be added, or what maximum size.\n\nAdditioanl text to explain where will the data be stored encrypted, and backup encrypted.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 52, y: 464, w: 270, h: 196 })
  title = new Text('No data yet…', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 82, y: 358, w: 211, h: 36 })
  illustration = new ImagePlacement(Asset.illustrationVault, { x: 145.5, y: 271, w: 80, h: 80 })
  constructor () {
    super('elementVaultEmpty', 375.0000000000001, 970, Color.lightGrey)
  }
}

export const elementVaultEmpty = new elementVaultEmptyClass()
