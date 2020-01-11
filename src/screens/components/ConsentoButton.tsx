import React from 'react'
import { ViewStyle, TouchableOpacity, Text, TextStyle } from 'react-native'
import { shadow } from '../../styles'
import { buttonContainerDisabled } from '../../styles/component/buttonContainerDisabled'
import { buttonContainerEnabled } from '../../styles/component/buttonContainerEnabled'
import { buttonContainerLight } from '../../styles/component/buttonContainerLight'

const disabledStyle = {
  ...buttonContainerDisabled.label.style,
  ...buttonContainerDisabled.shape.borderStyle(),
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

export interface IButtonStyle extends ViewStyle {
  width: number
  height: number
}

export interface IButtonProps {
  title: string
  enabled?: boolean
  disabled?: boolean
  light?: boolean
  thin?: boolean
  style?: IButtonStyle
  styleDisabled?: IButtonStyle
  onPress?: () => void
}

export function ConsentoButton (props: IButtonProps): JSX.Element {
  if (props.onPress === undefined || props.enabled === false || props.disabled === true) {
    return <Text style={{
      ...disabledStyle,
      ...(props.styleDisabled !== undefined ? props.styleDisabled : props.style)
    }}>
      {props.title}
    </Text>
  }
  const parentStyle: ViewStyle = {
    display: 'flex',
    top: props.style !== undefined ? props.style.top : 0,
    left: props.style !== undefined ? props.style.left : 0,
    position: props.style !== undefined ? props.style.position : undefined,
    width: props.style !== undefined ? props.style.width : undefined,
    height: props.style !== undefined ? props.style.height : undefined
  }
  const style: TextStyle = {
    ...props.light ? lightStyle : props.thin ? disabledStyle : activeStyle,
    ...props.style,
    left: undefined,
    top: undefined
  }
  if (props.style !== undefined) {
    delete props.style.left
    delete props.style.top
    delete props.style.position
  }
  return <TouchableOpacity style={parentStyle} onPress={props.onPress}>
    <Text style={style}>{props.title}</Text>
  </TouchableOpacity>
}
