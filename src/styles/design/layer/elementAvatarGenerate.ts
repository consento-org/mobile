// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { TextBox } from '../../util/TextBox'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'

export const elementAvatarGenerate = {
  name: 'elementAvatarGenerate',
  place: forSize(239, 210),
  layers: {
    label: new TextBox('label', 'Generate Avatar', {
      color: '#546e7aff',
      fontSize: 14.14,
      lineHeight: 26,
      textAlign: 'center',
      textTransform: 'uppercase',
      textAlignVertical: 'top'
    }, { x: 45, y: 159, w: 150, h: 26, r: 44, b: 25 }),
    placeholder: new ImagePlacement('placeholder', ImageAsset.iconAvatarPlaceholder, { x: 55.5, y: 22.5, w: 128, h: 128, r: 55.5, b: 59.5 }),
    avatar: new Polygon('avatar', { x: 58.5, y: 25.5, w: 122, h: 122, r: 58.5, b: 62.5 }, Color.coral, null, []),
    crossIcon: new ImagePlacement('crossIcon', ImageAsset.iconCrossGrey, { x: 205, y: 9.5, w: 24, h: 24, r: 10, b: 176.5 }),
    crossToucharea: new Polygon('crossToucharea', { x: 195, w: 44, h: 43, b: 167 }, Color.coral, null, [])
  }
}
