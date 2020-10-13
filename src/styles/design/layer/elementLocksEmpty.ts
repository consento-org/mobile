// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementBottomButton } from './elementBottomButton'

export const elementLocksEmpty = {
  name: 'elementLocksEmpty',
  place: forSize(375, 970),
  backgroundColor: Color.lightGrey,
  layers: {
    description: new TextBox('description', 'This vault is not locked yet. \n\nTo lock it out, you need at least one connection\nand add it as a ‘lockee’ here. \n\nAny connection of your choice can be a lockee. Just choose someone who will respond quickly when you need it.\n\nThat person will not be able to access your data. ', {
      ...TextStyles.BodyRobotoRegular18BlackCenter,
      lineHeight: 28
    }, { x: 52, y: 407, w: 270, h: 380, r: 53, b: 183 }),
    title: new TextBox('title', 'No lock yet…', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 84, y: 344, w: 206, h: 66, r: 85, b: 560 }),
    illustration: new ImagePlacement('illustration', ImageAsset.illustrationLock, { x: 145.5, y: 271, w: 80, h: 80, r: 149.5, b: 619 }),
    bottomButton: new LayerPlacement('bottomButton', elementBottomButton, elementBottomButton.layers, { y: 870, w: 375, h: 100 }, ({ button }) => ({
      button: new LayerPlacement('button', button.layer, button.layer.layers, button.place, ({ label }) => ({
        label: new TextBox('label', 'ADD', label.style, label.place)
      }))
    }))
  }
}
