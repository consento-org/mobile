// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { LayerPlacement } from '../../util/LayerPlacement'
import { buttonContainerLight } from './buttonContainerLight'
import { buttonContainerDisabled } from './buttonContainerDisabled'

export const elementConsentosBaseIdle = {
  name: 'elementConsentosBaseIdle',
  place: forSize(340, 114),
  layers: {
    timeLeft: new TextBox('timeLeft', '4:55 MINUTES LEFT', TextStyles.TimestampRobotoSmallCapRegular10RedCenter, { w: 340, h: 24, b: 90 }),
    allowButton: new LayerPlacement('allowButton', buttonContainerLight, buttonContainerLight.layers, { x: 80, y: 31, w: 180, h: 36, r: 80, b: 47 }, ({ label }) => ({
      label: new TextBox('label', 'allow', label.style, label.place)
    })),
    deleteButton: new LayerPlacement('deleteButton', buttonContainerDisabled, buttonContainerDisabled.layers, { x: 80, y: 78, w: 180, h: 36, r: 80 }, ({ label }) => ({
      label: new TextBox('label', 'deny', label.style, label.place)
    }))
  }
}
