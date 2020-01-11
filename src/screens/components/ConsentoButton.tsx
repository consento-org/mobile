import React from 'react'
import { ViewStyle, TouchableOpacity, Text, TextStyle } from 'react-native'
import { shadow } from '../../styles'
import { buttonContainerDisabled, ButtonContainerDisabledClass } from '../../styles/component/buttonContainerDisabled'
import { buttonContainerEnabled, ButtonContainerEnabledClass } from '../../styles/component/buttonContainerEnabled'
import { buttonContainerLight, ButtonContainerLightClass } from '../../styles/component/buttonContainerLight'
import { Link } from '../../styles/Component'

const disabledStyle = {
  top: 0,
  left: 0,
  ...buttonContainerDisabled.label.style,
  ...buttonContainerDisabled.shape.borderStyle(),
  width: buttonContainerDisabled.width,
  height: buttonContainerDisabled.height
}

const activeStyle = {
  top: 0,
  left: 0,
  backgroundColor: buttonContainerEnabled.shape.fill.color,
  borderRadius: buttonContainerEnabled.shape.borderRadius,
  width: buttonContainerEnabled.width,
  height: buttonContainerEnabled.height,
  ...shadow(),
  ...buttonContainerEnabled.label.style
}

const lightStyle = {
  top: 0,
  left: 0,
  backgroundColor: buttonContainerLight.shape.fill.color,
  borderRadius: buttonContainerLight.shape.borderRadius,
  width: buttonContainerLight.width,
  height: buttonContainerLight.height,
  ...shadow(),
  ...buttonContainerLight.label.style
}

export interface IButtonStyle extends ViewStyle {
  width: number
  height: number
}

export interface IButtonProps {
  title?: string
  enabled?: boolean
  disabled?: boolean
  light?: boolean
  thin?: boolean
  style?: IButtonStyle
  styleDisabled?: IButtonStyle
  proto?: Link<ButtonContainerDisabledClass | ButtonContainerEnabledClass | ButtonContainerLightClass, { label: string }>
  onPress?: () => void
}

export function ConsentoButton (props: IButtonProps): JSX.Element {
  const isDisabled = props.onPress === undefined || props.enabled === false || props.disabled === true
  if (isDisabled) {
    return <Text style={{
      ...disabledStyle,
      ...props.proto?.place.style(),
      ...(props.styleDisabled ?? props.style)
    }}>
      {props.title}
    </Text>
  }
  const parentStyle: ViewStyle = {
    display: 'flex',
    position: 'absolute',
    ...props.proto?.place.style(),
    ...props.style
  }
  const isLight = props.light || props.proto?.component instanceof ButtonContainerLightClass
  const isThin = props.thin || props.proto?.component instanceof ButtonContainerDisabledClass
  const style: TextStyle = {
    ...isLight ? lightStyle : isThin ? disabledStyle : activeStyle,
    ...props.style,
    left: undefined,
    top: undefined
  }
  return <TouchableOpacity style={parentStyle} onPress={props.onPress}>
    <Text style={style}>{props.title ?? props.proto?.text.label ?? '-missing-label-'}</Text>
  </TouchableOpacity>
}
