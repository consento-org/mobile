// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'

export const elementRelationListDivider = {
  name: 'elementRelationListDivider',
  place: forSize(375, 37),
  layers: {
    label: new TextBox('label', 'Y', TextStyles.LineDivider, { x: 27, w: 25, h: 30, r: 323, b: 7 }),
    divider: new Polygon('divider', { x: 58, y: 15, w: 268.71, h: 1, r: 48.28, b: 21 }, null, {
      fill: Color.activeGrey,
      thickness: 1,
      strokeLinecap: 'butt'
    }, [])
  }
}
