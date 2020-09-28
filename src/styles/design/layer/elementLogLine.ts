// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { Polygon } from '../../util/Polygon'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const elementLogLine = {
  name: 'elementLogLine',
  place: forSize(375, 98),
  backgroundColor: Color.lightGrey,
  layers: {
    bg: new Polygon('bg', { y: 34, w: 375, h: 64 }, Color.grey, { radius: 5 }, []),
    time: new TextBox('time', '02.10.2019', TextStyles.time, { x: 30, y: 0.5, w: 325, h: 33.5, r: 20, b: 64 }),
    text: new TextBox('text', 'Vault was created', TextStyles.BodyRobotoRegular18BlackLeft, { x: 30, y: 50, w: 325, h: 32, r: 20, b: 16 })
  }
}
