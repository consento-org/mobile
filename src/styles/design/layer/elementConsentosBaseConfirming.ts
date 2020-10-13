// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const elementConsentosBaseConfirming = {
  name: 'elementConsentosBaseConfirming',
  place: forSize(340, 114),
  layers: {
    line: new Polygon('line', { x: 122, y: 12, w: 96, h: 1, r: 122, b: 101 }, null, {
      fill: Color.darkGrey,
      thickness: 1,
      strokeLinecap: 'butt'
    }, []),
    state: new TextBox('state', 'confirming…', TextStyles.H5RobotoRegular24GreyCenter, { y: 30.5, w: 340, h: 36, b: 47.5 })
  }
}
