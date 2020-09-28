// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { buttonContainerEnabled } from './buttonContainerEnabled'
import { TextBox } from '../../util/TextBox'
import { Polygon } from '../../util/Polygon'

export const elementSealVaultActive = {
  name: 'elementSealVaultActive',
  place: forSize(360, 60),
  backgroundColor: Color.grey,
  layers: {
    enabled: new LayerPlacement('enabled', buttonContainerEnabled, buttonContainerEnabled.layers, { x: 90, y: 12, w: 180, h: 36, r: 90, b: 12 }, ({ label }) => ({
      label: new TextBox('label', 'lock', label.style, label.place)
    })),
    borderBottom: new Polygon('borderBottom', { y: 58.25, w: 360, h: 2, b: -0.25 }, null, {
      fill: '#d9d9d9ff',
      thickness: 1,
      strokeLinecap: 'butt'
    }, [])
  }
}
