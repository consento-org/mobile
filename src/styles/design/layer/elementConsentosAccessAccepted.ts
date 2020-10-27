// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementConsentosBase } from './elementConsentosBase'
import { elementConsentosBaseAccepted } from './elementConsentosBaseAccepted'
import { TextBox } from '../../util/TextBox'

export const elementConsentosAccessAccepted = {
  name: 'elementConsentosAccessAccepted',
  place: forSize(340, 280),
  backgroundColor: Color.black,
  layers: {
    requestBase: new LayerPlacement('requestBase', elementConsentosBase, elementConsentosBase.layers, { w: 340, h: 280 }),
    state: new LayerPlacement('state', elementConsentosBaseAccepted, elementConsentosBaseAccepted.layers, { y: 152, w: 340, h: 114, b: 14 }, ({ deleteButton }) => ({
      deleteButton: new LayerPlacement('deleteButton', deleteButton.layer, deleteButton.layer.layers, deleteButton.place, ({ label }) => ({
        label: new TextBox('label', 'delete', label.style, label.place)
      }))
    }))
  }
}
