// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

export const elementCardVaultLoading = {
  name: 'elementCardVaultLoading',
  place: forSize(160, 161),
  layers: {
    background: new ImagePlacement('background', ImageAsset.elementCardVaultBackground, { y: 31, w: 160, h: 130 }),
    title: new TextBox('title', 'Name', TextStyles.H6RobotoMedium18BlackCenter, { x: 5, y: 86, w: 150, h: 56, r: 5, b: 19 }),
    lastAccess: new TextBox('lastAccess', 'Last access: 02.10.2019', TextStyles.TimestampRobotoSmallCapRegular10BlackLeft, { x: 5, y: 141, w: 150, h: 16, r: 5, b: 4 }),
    status: new TextBox('status', 'loading', {
      ...TextStyles.TITLERobotoSmallCapRegular12RedCenter,
      color: Color.darkGrey,
      lineHeight: 14,
      textAlignVertical: 'top'
    }, { x: 5, y: 68, w: 150, h: 26, r: 5, b: 67 }),
    icon: new ImagePlacement('icon', ImageAsset.iconVaultBigLoading, { x: 52.5, w: 55, h: 62, r: 52.5, b: 99 })
  }
}
