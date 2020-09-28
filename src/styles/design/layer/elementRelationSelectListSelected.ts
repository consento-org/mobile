// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Polygon } from '../../util/Polygon'

export const elementRelationSelectListSelected = {
  name: 'elementRelationSelectListSelected',
  place: forSize(375, 100),
  layers: {
    icon: new ImagePlacement('icon', ImageAsset.iconToggleCheckedGreen, { x: 323, y: 38.5, w: 24, h: 24, r: 28, b: 37.5 }),
    relationID: new TextBox('relationID', 'A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 14
    }, { x: 105, y: 56, w: 191, h: 24, r: 79, b: 20 }),
    relationName: new TextBox('relationName', '<Unnamed>', TextStyles.H6RobotoMedium18BlackLeft, { x: 105, y: 30, w: 191, h: 24, r: 79, b: 46 }),
    avatarCut: new Polygon('avatarCut', { x: 31, y: 20, w: 60, h: 60, r: 284, b: 20 }, Color.blue, null, [])
  }
}
