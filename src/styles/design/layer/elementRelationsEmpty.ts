// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'

export const elementRelationsEmpty = {
  name: 'elementRelationsEmpty',
  place: forSize(375, 970),
  backgroundColor: Color.lightGrey,
  layers: {
    description: new TextBox('description', 'Just press the + button and scan the QRcode of a Consento user’s device.\n\nYou can name that person as you whis, only you will know it.\n\nYou and that person could then add each other as lockee of your vaults.', {
      ...TextStyles.BodyRobotoRegular18BlackCenter,
      lineHeight: 28
    }, { x: 58, y: 461, w: 270, h: 330, r: 47, b: 179 }),
    title: new TextBox('title', 'Add relations !', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 68.5, y: 398, w: 238, h: 66, r: 68.5, b: 506 }),
    illustration: new ImagePlacement('illustration', ImageAsset.illustrationFriends, { x: 26.89, y: 210, w: 321.2, h: 178, r: 26.89, b: 582 })
  }
}
