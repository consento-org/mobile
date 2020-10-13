// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { buttonContainerDisabled } from './buttonContainerDisabled'
import { TextBox } from '../../util/TextBox'
import { Polygon } from '../../util/Polygon'

export const elementSealVaultIdle = {
  name: 'elementSealVaultIdle',
  place: forSize(360, 60),
  backgroundColor: Color.grey,
  layers: {
    disabled: new LayerPlacement('disabled', buttonContainerDisabled, buttonContainerDisabled.layers, { x: 90, y: 12, w: 180, h: 36, r: 90, b: 12 }, ({ label }) => ({
      label: new TextBox('label', 'lock', label.style, label.place)
    })),
    borderBottom: new Polygon('borderBottom', { y: 58.25, w: 360, h: 2, b: -0.25 }, null, {
      fill: '#d9d9d9ff',
      thickness: 1,
      strokeLinecap: 'butt'
    }, [])
  }
}
