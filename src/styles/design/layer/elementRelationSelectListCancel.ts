// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const elementRelationSelectListCancel = {
  name: 'elementRelationSelectListCancel',
  place: forSize(375, 100),
  layers: {
    icon: new ImagePlacement('icon', ImageAsset.iconDeleteGrey, { x: 311.5, y: 23, w: 48, h: 48, r: 15.5, b: 29 }),
    avatarCut: new Polygon('avatarCut', { x: 31, y: 20, w: 60, h: 60, r: 284, b: 20 }, Color.blue, null, []),
    iconLabel: new TextBox('iconLabel', 'Cancel', {
      ...TextStyles.BodyRobotoRegular18RedCenter,
      color: Color.activeGrey,
      lineHeight: 21
    }, { x: 302, y: 60, w: 67, h: 20, r: 6, b: 20 }),
    relationID: new TextBox('relationID', 'A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 14
    }, { x: 105, y: 56, w: 191, h: 24, r: 79, b: 20 }),
    relationName: new TextBox('relationName', '<Unnamed>', {
      ...TextStyles.H6RobotoMedium18BlackLeft,
      color: Color.darkGrey
    }, { x: 105, y: 30, w: 191, h: 24, r: 79, b: 46 }),
    state: new TextBox('state', 'pending…', {
      ...TextStyles.H6RobotoMedium18BlackLeft,
      color: Color.darkGrey,
      fontSize: 12,
      lineHeight: 14,
      textAlign: 'right',
      textAlignVertical: 'top'
    }, { x: 310, y: 12, w: 51, h: 16, r: 14, b: 72 })
  }
}
