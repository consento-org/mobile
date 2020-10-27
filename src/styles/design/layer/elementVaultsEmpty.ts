// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'

export const elementVaultsEmpty = {
  name: 'elementVaultsEmpty',
  place: forSize(375, 970),
  backgroundColor: Color.lightGrey,
  layers: {
    description: new TextBox('description', 'You have no vault yet. \n\nJust press the + button down there, and start encrypting files.', {
      ...TextStyles.BodyRobotoRegular18BlackCenter,
      lineHeight: 28
    }, { x: 58, y: 461, w: 270, h: 330, r: 47, b: 179 }),
    title: new TextBox('title', 'Create vaults !', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 72, y: 408, w: 232, h: 66, r: 71, b: 496 }),
    illustration: new ImagePlacement('illustration', ImageAsset.illustrationVaults, { x: 26.89, y: 210, w: 321, h: 178, r: 27.1, b: 582 })
  }
}
