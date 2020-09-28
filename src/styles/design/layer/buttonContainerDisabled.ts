// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const buttonContainerDisabled = {
  name: 'buttonContainerDisabled',
  place: forSize(96, 36),
  layers: {
    shape: new Polygon('shape', { w: 96, h: 36 }, null, {
      fill: Color.borderDark,
      thickness: 1,
      strokeLinecap: 'butt',
      radius: 16
    }, []),
    label: new TextBox('label', 'Button', TextStyles.BUTTONRobotoSmallCapRegular18BlackCenter, { x: 13, w: 70, h: 36, r: 13 })
  }
}
