// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementBottomButton } from './elementBottomButton'
import { TextBox } from '../../util/TextBox'
import { elementRelationSelectListSelected } from './elementRelationSelectListSelected'
import { elementRelationSelectListUnselected } from './elementRelationSelectListUnselected'
import { TextStyles } from '../TextStyles'

export const elementRelationSelectListAdd = {
  name: 'elementRelationSelectListAdd',
  place: forSize(375, 970),
  backgroundColor: Color.lightGrey,
  layers: {
    bottomButton: new LayerPlacement('bottomButton', elementBottomButton, elementBottomButton.layers, { y: 870, w: 375, h: 100 }, ({ button }) => ({
      button: new LayerPlacement('button', button.layer, button.layer.layers, button.place, ({ label }) => ({
        label: new TextBox('label', 'save', label.style, label.place)
      }))
    })),
    selected: new LayerPlacement('selected', elementRelationSelectListSelected, elementRelationSelectListSelected.layers, { y: 445, w: 375, h: 100, b: 425 }),
    unselected: new LayerPlacement('unselected', elementRelationSelectListUnselected, elementRelationSelectListUnselected.layers, { y: 345, w: 375, h: 100, b: 525 }),
    description: new TextBox('description', 'Dummy text to explain that the ‘lockee’ do not see the content of th encrypted vault.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 52.5, y: 180, w: 270, h: 84, r: 52.5, b: 706 })
  }
}
