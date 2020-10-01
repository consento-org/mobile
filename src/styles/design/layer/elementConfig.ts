// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementBottomButton } from './elementBottomButton'
import { TextBox } from '../../util/TextBox'
import { elementFormInputField } from './elementFormInputField'
import { buttonContainerDisabled } from './buttonContainerDisabled'
import { buttonContainerEnabled } from './buttonContainerEnabled'
import { elementCredits } from './elementCredits'

export const elementConfig = {
  name: 'elementConfig',
  place: forSize(375, 970),
  backgroundColor: Color.white,
  layers: {
    bottomButton: new LayerPlacement('bottomButton', elementBottomButton, elementBottomButton.layers, { y: 870, w: 375, h: 100 }, ({ button }) => ({
      button: new LayerPlacement('button', button.layer, button.layer.layers, button.place, ({ label }) => ({
        label: new TextBox('label', 'Save Changes', label.style, label.place)
      }))
    })),
    host: new LayerPlacement('host', elementFormInputField, elementFormInputField.layers, { y: 18, w: 375, h: 85, b: 867 }, ({ active, inactive, label, caption }) => ({
      active: new TextBox('active', '//notify-2.consento.org', active.style, active.place),
      inactive: new TextBox('inactive', '//notify-2.consento.org', inactive.style, inactive.place),
      label: new TextBox('label', 'host', label.style, label.place),
      caption: new TextBox('caption', 'during beta we need to connect to a server.', caption.style, caption.place)
    })),
    expire: new LayerPlacement('expire', elementFormInputField, elementFormInputField.layers, { y: 119, w: 375, h: 85, b: 766 }, ({ active, inactive, label, caption }) => ({
      active: new TextBox('active', '300', active.style, active.place),
      inactive: new TextBox('inactive', '300', inactive.style, inactive.place),
      label: new TextBox('label', 'expire', label.style, label.place),
      caption: new TextBox('caption', 'seconds it takes for a consento to expire.', caption.style, caption.place)
    })),
    reset1: new LayerPlacement('reset1', buttonContainerDisabled, buttonContainerDisabled.layers, { x: 23, y: 234, w: 180, h: 36, r: 172, b: 700 }, ({ label }) => ({
      label: new TextBox('label', 'reset', label.style, label.place)
    })),
    reset2: new LayerPlacement('reset2', buttonContainerEnabled, buttonContainerEnabled.layers, { x: 23, y: 234, w: 180, h: 36, r: 172, b: 700 }, ({ label }) => ({
      label: new TextBox('label', 'RESET', label.style, label.place)
    })),
    credits: new LayerPlacement('credits', elementCredits, elementCredits.layers, { x: 21, y: 323, w: 322, h: 168, r: 32, b: 479 })
  }
}
