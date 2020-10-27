// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const elementRelationListItem = {
  name: 'elementRelationListItem',
  place: forSize(375, 100),
  layers: {
    icon: new ImagePlacement('icon', ImageAsset.iconForwardGrey, { x: 315, y: 20, w: 60, h: 60, b: 20 }),
    avatarCut: new Polygon('avatarCut', { x: 31, y: 20, w: 60, h: 60, r: 284, b: 20 }, Color.blue, null, []),
    relationID: new TextBox('relationID', 'A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 14
    }, { x: 105, y: 56, w: 191, h: 24, r: 79, b: 20 }),
    relationName: new TextBox('relationName', '<Unnamed>', TextStyles.H6RobotoMedium18BlackLeft, { x: 105, y: 30, w: 191, h: 24, r: 79, b: 46 })
  }
}
