// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementBottomButton } from './elementBottomButton'

export const elementLocksNoLockee = {
  name: 'elementLocksNoLockee',
  place: forSize(375, 970),
  backgroundColor: Color.lightGrey,
  layers: {
    description: new TextBox('description', 'You have no relationship yet. Create relationship on the main screen before you can add a Lockee!', {
      ...TextStyles.BodyRobotoRegular18BlackCenter,
      lineHeight: 28
    }, { x: 52, y: 461, w: 270, h: 143, r: 53, b: 366 }),
    title: new TextBox('title', 'No Relationship', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 55, y: 358, w: 265, h: 66, r: 55, b: 546 }),
    illustration: new ImagePlacement('illustration', ImageAsset.illustrationLock, { x: 145.5, y: 271, w: 80, h: 80, r: 149.5, b: 619 }),
    bottomButton: new LayerPlacement('bottomButton', elementBottomButton, elementBottomButton.layers, { y: 870, w: 375, h: 100 }, ({ button }) => ({
      button: new LayerPlacement('button', button.layer, button.layer.layers, button.place, ({ label }) => ({
        label: new TextBox('label', 'ADD', label.style, label.place)
      }))
    }))
  }
}
