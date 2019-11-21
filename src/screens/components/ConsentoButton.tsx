import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { shadow } from '../../styles'
import { buttonContainerDisabled } from '../../styles/component/buttonContainerDisabled'
import { buttonContainerEnabled } from '../../styles/component/buttonContainerEnabled'
import { buttonContainerLight } from '../../styles/component/buttonContainerLight'

const disabledStyle = {
  ... buttonContainerDisabled.label.style,
  ... buttonContainerDisabled.shape.borderStyle(),
  width: buttonContainerDisabled.width,
  height: buttonContainerDisabled.height
}

const activeStyle = {
  backgroundColor: buttonContainerEnabled.shape.fill.color,
  borderRadius: buttonContainerEnabled.shape.borderRadius,
  width: buttonContainerEnabled.width,
  height: buttonContainerEnabled.height,
  ...shadow(),
  ...buttonContainerEnabled.label.style
}

const lightStyle = {
  backgroundColor: buttonContainerLight.shape.fill.color,
  borderRadius: buttonContainerLight.shape.borderRadius,
  width: buttonContainerLight.width,
  height: buttonContainerLight.height,
  ...shadow(),
  ...buttonContainerLight.label.style
}

export interface IButtonProps {
  title: string
  enabled?: boolean
  disabled?: boolean
  light?: boolean
  style?: {
    width: number
    height: number
  }
  onPress?: () => void
}

export function ConsentoButton (props: IButtonProps) {
  if (props.onPress === undefined || props.enabled === false || props.disabled === true) {
    return <Text style={{
      ...disabledStyle,
      width: props.style.width,
      height: props.style.height
    }}>{ props.title }</Text>
  }
  return <TouchableOpacity style={{ display: 'flex' }} onPress={ props.onPress }>
    <Text style={{
      ...props.light ? lightStyle : activeStyle,
      width: props.style.width,
      height: props.style.height
    }}>{ props.title }</Text>
  </TouchableOpacity>
}