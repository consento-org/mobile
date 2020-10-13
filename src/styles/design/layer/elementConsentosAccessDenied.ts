// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementConsentosBase } from './elementConsentosBase'
import { elementConsentosBaseDenied } from './elementConsentosBaseDenied'
import { TextBox } from '../../util/TextBox'

export const elementConsentosAccessDenied = {
  name: 'elementConsentosAccessDenied',
  place: forSize(340, 280),
  backgroundColor: Color.black,
  layers: {
    requestBase: new LayerPlacement('requestBase', elementConsentosBase, elementConsentosBase.layers, { w: 340, h: 280 }),
    state: new LayerPlacement('state', elementConsentosBaseDenied, elementConsentosBaseDenied.layers, { y: 152.5, w: 340, h: 114, b: 13.5 }, ({ deleteButton }) => ({
      deleteButton: new LayerPlacement('deleteButton', deleteButton.layer, deleteButton.layer.layers, deleteButton.place, ({ label }) => ({
        label: new TextBox('label', 'delete', label.style, label.place)
      }))
    }))
  }
}
