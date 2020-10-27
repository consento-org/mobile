// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'

export const elementConsentosEmpty = {
  name: 'elementConsentosEmpty',
  place: forSize(375, 970),
  backgroundColor: Color.lightGrey,
  layers: {
    lastUpdate: new TextBox('lastUpdate', 'Last update: 2 seconds ago', {
      ...TextStyles.H6BlackHighEmphasisCenter,
      color: '#7c8792ff',
      fontSize: 13,
      lineHeight: 15,
      textAlignVertical: 'center'
    }, { x: 92, y: 581, w: 202, h: 24, r: 81, b: 365 }),
    description: new TextBox('description', 'You don’t have any Consento request for the moment. ', {
      ...TextStyles.BodyRobotoRegular18BlackCenter,
      lineHeight: 28
    }, { x: 58, y: 407, w: 270, h: 56, r: 47, b: 507 }),
    title: new TextBox('title', 'All set up !', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 102, y: 344, w: 171, h: 66, r: 102, b: 560 }),
    illustration: new ImagePlacement('illustration', ImageAsset.illustrationSun, { x: 79.5, y: 124, w: 217, h: 213, r: 78.5, b: 633 })
  }
}
