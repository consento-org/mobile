// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementBottomButton } from './elementBottomButton'

export const elementVaultEmpty = {
  name: 'elementVaultEmpty',
  place: forSize(375, 970),
  backgroundColor: Color.lightGrey,
  layers: {
    description: new TextBox('description', 'In this MVP version of Consento,\nyou can upload pictures \nor create text file. \n\nNo maximum file size. Your device will tell when it is full. \n\nNote: This is a MVP version.  Data will ONLY be stored here. When the app updates or resets, data willl be lost.', {
      ...TextStyles.BodyRobotoRegular18BlackCenter,
      lineHeight: 28
    }, { x: 52, y: 407, w: 270, h: 330, r: 53, b: 233 }),
    title: new TextBox('title', 'No data yet…', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 82, y: 344, w: 211, h: 66, r: 82, b: 560 }),
    illustration: new ImagePlacement('illustration', ImageAsset.illustrationVault, { x: 145.5, y: 271, w: 80, h: 80, r: 149.5, b: 619 }),
    bottomButton: new LayerPlacement('bottomButton', elementBottomButton, elementBottomButton.layers, { y: 870, w: 375, h: 100 }, ({ button }) => ({
      button: new LayerPlacement('button', button.layer, button.layer.layers, button.place, ({ label }) => ({
        label: new TextBox('label', 'ADD', label.style, label.place)
      }))
    }))
  }
}
