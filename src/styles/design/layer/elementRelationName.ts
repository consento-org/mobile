// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementBottomButton } from './elementBottomButton'
import { TextBox } from '../../util/TextBox'
import { elementFormInputField } from './elementFormInputField'
import { elementAvatarGenerate } from './elementAvatarGenerate'

export const elementRelationName = {
  name: 'elementRelationName',
  place: forSize(375, 970),
  backgroundColor: Color.white,
  layers: {
    bottomButton: new LayerPlacement('bottomButton', elementBottomButton, elementBottomButton.layers, { y: 870, w: 375, h: 100 }, ({ button }) => ({
      button: new LayerPlacement('button', button.layer, button.layer.layers, button.place, ({ label }) => ({
        label: new TextBox('label', 'Save Changes', label.style, label.place)
      }))
    })),
    relationName: new LayerPlacement('relationName', elementFormInputField, elementFormInputField.layers, { y: 15, w: 375, h: 85, b: 870 }, ({ active, label, caption }) => ({
      active: new TextBox('active', 'Name', active.style, active.place),
      label: new TextBox('label', 'name', label.style, label.place),
      caption: new TextBox('caption', 'only you will see this name.', caption.style, caption.place)
    })),
    elementAvatarGenerate: new LayerPlacement('elementAvatarGenerate', elementAvatarGenerate, elementAvatarGenerate.layers, { x: 57, y: 136, w: 239, h: 210, r: 79, b: 624 })
  }
}
