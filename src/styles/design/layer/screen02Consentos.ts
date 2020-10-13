// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementConsentosAccessAccepted } from './elementConsentosAccessAccepted'
import { TextBox } from '../../util/TextBox'

export const screen02Consentos = {
  name: 'screen02Consentos',
  place: forSize(375, 812),
  backgroundColor: Color.mediumGrey,
  layers: {
    a: new LayerPlacement('a', elementConsentosAccessAccepted, elementConsentosAccessAccepted.layers, { x: 17.5, y: 109, w: 340, h: 280, r: 17.5, b: 423 }, ({ state }) => ({
      state: new LayerPlacement('state', state.layer, state.layer.layers, state.place, ({ deleteButton }) => ({
        deleteButton: new LayerPlacement('deleteButton', deleteButton.layer, deleteButton.layer.layers, deleteButton.place, ({ label }) => ({
          label: new TextBox('label', 'delete', label.style, label.place)
        }))
      }))
    })),
    b: new LayerPlacement('b', elementConsentosAccessAccepted, elementConsentosAccessAccepted.layers, { x: 17.5, y: 406, w: 340, h: 280, r: 17.5, b: 126 }, ({ state }) => ({
      state: new LayerPlacement('state', state.layer, state.layer.layers, state.place, ({ deleteButton }) => ({
        deleteButton: new LayerPlacement('deleteButton', deleteButton.layer, deleteButton.layer.layers, deleteButton.place, ({ label }) => ({
          label: new TextBox('label', 'delete', label.style, label.place)
        }))
      }))
    }))
  }
}
