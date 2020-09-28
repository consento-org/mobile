// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { Polygon } from '../../util/Polygon'

export const elementTabBarTabActive = {
  name: 'elementTabBarTabActive',
  place: forSize(98, 48),
  backgroundColor: Color.grey,
  layers: {
    label: new TextBox('label', 'Label', {
      ...TextStyles.SubtitleRobotoBold13BlackCenter,
      textTransform: 'uppercase',
      textAlignVertical: 'center'
    }, { w: 98, h: 48 }),
    bottomLine: new Polygon('bottomLine', { x: -0.25, y: 47, w: 99, h: 2, r: -0.75, b: -1 }, null, {
      fill: Color.activeGrey,
      thickness: 2,
      strokeLinecap: 'butt'
    }, [])
  }
}
