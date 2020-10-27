// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementBottomFadeout } from './elementBottomFadeout'
import { buttonContainerLight } from './buttonContainerLight'
import { TextBox } from '../../util/TextBox'

export const elementBottomButton = {
  name: 'elementBottomButton',
  place: forSize(375, 100),
  layers: {
    bottomArea: new LayerPlacement('bottomArea', elementBottomFadeout, elementBottomFadeout.layers, { w: 375, h: 100 }),
    button: new LayerPlacement('button', buttonContainerLight, buttonContainerLight.layers, { x: 52.5, y: 32, w: 270, h: 36, r: 52.5, b: 32 }, ({ label }) => ({
      label: new TextBox('label', '+', label.style, label.place)
    }))
  }
}
