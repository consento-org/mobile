// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const buttonContainerLight = {
  name: 'buttonContainerLight',
  place: forSize(96, 36),
  layers: {
    shape: new Polygon('shape', { w: 96, h: 36 }, Color.avatar1, { radius: 16 }, [
      { x: 0, y: 1, blur: 3, spread: 0, color: '#00000033' },
      { x: 0, y: 2, blur: 1, spread: -1, color: Color.borderDark },
      { x: 0, y: 1, blur: 1, spread: 0, color: '#00000024' }
    ]),
    label: new TextBox('label', 'Button', TextStyles.BUTTONRobotoSmallCapRegular18WhiteCenter, { x: 13, w: 70, h: 36, r: 13 })
  }
}
