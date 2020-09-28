// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementLineBorderIndented } from './elementLineBorderIndented'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const elementLineData = {
  name: 'elementLineData',
  place: forSize(375, 60),
  backgroundColor: Color.white,
  layers: {
    separator: new LayerPlacement('separator', elementLineBorderIndented, elementLineBorderIndented.layers, { y: 43, w: 375, h: 17 }),
    open: new ImagePlacement('open', ImageAsset.iconForwardGrey, { x: 315, y: 1, w: 60, h: 60, b: -1 }),
    menu: new ImagePlacement('menu', ImageAsset.iconDotsHorizontal, { x: 260, y: 1, w: 55, h: 60, r: 60, b: -1 }),
    label: new TextBox('label', 'Label', {
      ...TextStyles.H6BlackHighEmphasisCenter,
      fontSize: 16,
      lineHeight: 19,
      textAlign: 'left',
      textAlignVertical: 'center'
    }, { x: 15, y: 19, w: 245, h: 24, r: 115, b: 17 })
  }
}
