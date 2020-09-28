// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const elementPopUpMenu = {
  name: 'elementPopUpMenu',
  place: forSize(375, 812),
  layers: {
    bg: new Polygon('bg', { w: 375, h: 812 }, '#00000066', null, []),
    buttonBg: new Polygon('buttonBg', { x: 10, y: 746, w: 355, h: 57, r: 10, b: 9 }, Color.white, { radius: 13 }, []),
    cancel: new TextBox('cancel', 'Cancel', TextStyles.BodyRobotoRegular18BlueCenter, { x: 10, y: 746, w: 355, h: 57, r: 10, b: 9 }),
    bottomBg: new Polygon('bottomBg', { x: 10, y: 682, w: 355, h: 54, r: 10, b: 76 }, null, null, []),
    disabled: new TextBox('disabled', '...', {
      color: '#a4aab3ff',
      fontSize: 20,
      lineHeight: 24,
      textAlign: 'center',
      textTransform: 'none',
      textAlignVertical: 'center'
    }, { x: 10, y: 681.05, w: 355, h: 55, r: 10, b: 75.94 }),
    createText: new TextBox('createText', 'Create text file', TextStyles.BodyRobotoRegular18BlueCenter, { x: 10, y: 624, w: 355, h: 56.55, r: 10, b: 131.44 }),
    takePicture: new TextBox('takePicture', 'Take picture', TextStyles.BodyRobotoRegular18BlueCenter, { x: 6.5, y: 565, w: 358.5, h: 58.5, r: 10, b: 188.5 }),
    topBg: new Polygon('topBg', { x: 10, y: 521, w: 355, h: 45, r: 10, b: 246 }, null, { radius: 13 }, []),
    separator: new Polygon('separator', { x: 10, y: 565, w: 355, h: 1, r: 10, b: 246 }, Color.darkGrey, null, []),
    description: new TextBox('description', 'Add data', {
      ...TextStyles.SubtitleRobotoRegular13GreyCenter,
      textAlignVertical: 'center'
    }, { x: 10, y: 521, w: 355, h: 44, r: 10, b: 247 })
  }
}
