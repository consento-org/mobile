// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { Polygon } from '../../util/Polygon'

export const elementTextEditor = {
  name: 'elementTextEditor',
  place: forSize(375, 675),
  backgroundColor: Color.white,
  layers: {
    title: new TextBox('title', 'Untitled', TextStyles.H5RobotoRegular24BlackLeft, { x: 15, y: 68, w: 344, h: 41.8, r: 16, b: 565.19 }),
    size: new TextBox('size', 'Size: 11 Ko', TextStyles.TimestampRobotoSmallCapRegular10BlackCenter, { x: 16, y: 106, w: 344, h: 24, r: 15, b: 545 }),
    save: new TextBox('save', 'Save', {
      ...TextStyles.BodyRobotoRegular18BlueLeft,
      textAlign: 'right'
    }, { x: 258, y: 41, w: 101, h: 24, r: 16, b: 610 }),
    close: new TextBox('close', 'Close', TextStyles.BodyRobotoRegular18BlueLeft, { x: 16, y: 41, w: 114, h: 24, r: 245, b: 610 }),
    readable: new TextBox('readable', 'MyBank\n6178-25799\nAD870hJ72Oi\n\nBank of the World\nFJ&-3449-2998\n190287389202', TextStyles.BodyRobotoRegular18BlackLeft, { x: 15, y: 155, w: 344, h: 505, r: 16, b: 15 }),
    closeSize: new Polygon('closeSize', { w: 129.5, h: 65, r: 245.5, b: 610 }, '#da552f1c', null, []),
    saveSize: new Polygon('saveSize', { x: 258.5, w: 116.5, h: 65, b: 610 }, '#da552f1c', null, [])
  }
}
