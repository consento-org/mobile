// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const elementBottomNavVaultActive = {
  name: 'elementBottomNavVaultActive',
  place: forSize(98, 56),
  layers: {
    icon: new ImagePlacement('icon', ImageAsset.iconVaultActive, { x: 37, y: 8, w: 24, h: 24, r: 37, b: 24 }),
    title: new TextBox('title', 'Vaults', TextStyles.SubtitleRobotoBold13BlackCenter, { y: 37, w: 98, h: 16, b: 3 })
  }
}
