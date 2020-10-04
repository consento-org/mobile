// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { LayerPlacement } from '../../util/LayerPlacement'
import { buttonContainerDisabled } from './buttonContainerDisabled'

export const elementConsentosBaseAccepted = {
  name: 'elementConsentosBaseAccepted',
  place: forSize(340, 114),
  layers: {
    line: new Polygon('line', { x: 122, y: 10, w: 96, h: 1, r: 122, b: 103 }, null, {
      fill: Color.darkGrey,
      thickness: 1,
      strokeLinecap: 'butt'
    }, []),
    state: new TextBox('state', 'accepted', TextStyles.H5RobotoRegular24GreenCenter, { y: 31, w: 340, h: 36, b: 47 }),
    deleteButton: new LayerPlacement('deleteButton', buttonContainerDisabled, buttonContainerDisabled.layers, { x: 80, y: 78, w: 180, h: 36, r: 80 }, ({ label }) => ({
      label: new TextBox('label', 'delete', label.style, label.place)
    }))
  }
}