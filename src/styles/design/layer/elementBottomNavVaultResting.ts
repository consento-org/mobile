// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const elementBottomNavVaultResting = {
  name: 'elementBottomNavVaultResting',
  place: forSize(98, 56),
  layers: {
    icon: new ImagePlacement('icon', ImageAsset.iconVaultIdle, { x: 37, y: 8, w: 23, h: 24, r: 38, b: 24 }),
    title: new TextBox('title', 'Vaults', TextStyles.SubtitleRobotoRegular13BlackCenter, { y: 37, w: 98, h: 16, b: 3 })
  }
}
