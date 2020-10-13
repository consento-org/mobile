// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { Polygon } from '../../util/Polygon'

export const elementTabBarTabResting = {
  name: 'elementTabBarTabResting',
  place: forSize(98, 48),
  backgroundColor: Color.grey,
  layers: {
    label: new TextBox('label', 'Label', {
      ...TextStyles.SubtitleRobotoRegular13BlackCenter,
      textTransform: 'uppercase',
      textAlignVertical: 'center'
    }, { w: 98, h: 48 }),
    effect: new Polygon('effect', { x: 64, y: 4, w: 34, h: 32, b: 12 }, Color.white, null, [])
  }
}
