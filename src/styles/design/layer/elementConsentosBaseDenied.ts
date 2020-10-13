// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { LayerPlacement } from '../../util/LayerPlacement'
import { buttonContainerDisabled } from './buttonContainerDisabled'

export const elementConsentosBaseDenied = {
  name: 'elementConsentosBaseDenied',
  place: forSize(340, 114),
  layers: {
    line: new Polygon('line', { x: 122, y: 12, w: 96, h: 1, r: 122, b: 101 }, null, {
      fill: Color.darkGrey,
      thickness: 1,
      strokeLinecap: 'butt'
    }, []),
    state: new TextBox('state', 'denied', {
      ...TextStyles.H5RobotoRegular24RedCenter,
      lineHeight: 28
    }, { y: 30.5, w: 340, h: 36, b: 47.5 }),
    deleteButton: new LayerPlacement('deleteButton', buttonContainerDisabled, buttonContainerDisabled.layers, { x: 80, y: 78, w: 180, h: 36, r: 80 }, ({ label }) => ({
      label: new TextBox('label', 'delete', label.style, label.place)
    }))
  }
}
