import React from 'react'
import { ViewStyle, TouchableOpacity, Text, TextStyle, StyleSheet, StyleProp, View } from 'react-native'
import { shadow } from '../../styles'
import { buttonContainerDisabled } from '../../styles/design/layer/buttonContainerDisabled'
import { buttonContainerEnabled } from '../../styles/design/layer/buttonContainerEnabled'
import { buttonContainerLight } from '../../styles/design/layer/buttonContainerLight'
import { exists } from '../../styles/util/lang'
import { Polygon } from '../../styles/util/Polygon'
import { TextBox } from '../../styles/util/TextBox'
import { ILayer } from '../../styles/util/types'

export type IButtonProto = ILayer<{ shape: Polygon, label: TextBox }>

export interface IButtonProps {
  title?: string
  enabled?: boolean
  disabled?: boolean
  light?: boolean
  thin?: boolean
  src?: IButtonProto
  srcDisabled?: IButtonProto
  style?: ViewStyle
  labelStyle?: TextStyle
  styleDisabled?: ViewStyle
  labelStyleDisabled?: TextStyle
  onPress?: () => void
}

function getProto (props: IButtonProps, isDisabled: boolean): IButtonProto {
  if (exists(props.src)) {
    if (isDisabled && exists(props.srcDisabled)) {
      return props.srcDisabled
    }
    return props.src
  }
  if (isDisabled) {
    return buttonContainerDisabled
  }
  if (props.light) {
    return buttonContainerLight
  }
  if (props.thin) {
    return buttonContainerDisabled
  }
  return buttonContainerEnabled
}

const protoShapeStyles: WeakMap<IButtonProto, StyleProp<ViewStyle>> = new WeakMap()
function getShapeStyle (proto: IButtonProto): StyleProp<ViewStyle> {
  let style = protoShapeStyles.get(proto)
  if (style === undefined) {
    style = StyleSheet.create({
      proto: {
        top: 0,
        left: 0,
        display: 'flex',
        flex: 0,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: proto.layers.shape.fill.color,
        ...proto.layers.shape.borderStyle(),
        minWidth: proto.place.width,
        height: proto.place.height,
        ...proto.layers.shape.shadows.length > 0 ? shadow() : {}
      }
    }).proto
    protoShapeStyles.set(proto, style)
  }
  return style
}

const protoLabelStyles: WeakMap<IButtonProto, StyleProp<TextStyle>> = new WeakMap()
function getLabelStyle (proto: IButtonProto): StyleProp<TextStyle> {
  let style = protoLabelStyles.get(proto)
  if (style === undefined) {
    style = StyleSheet.create({
      proto: {
        ...proto.layers.label.style,
        flexWrap: 'nowrap',
        marginLeft: proto.layers.label.place.left,
        marginRight: proto.layers.label.place.right
      }
    }).proto
    protoLabelStyles.set(proto, style)
  }
  return style
}

export function ConsentoButton (props: IButtonProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
  const isDisabled = props.onPress === undefined || props.enabled === false || props.disabled === true
  const proto = getProto(props, isDisabled)
  const title = props.title ?? props.src?.layers.label.text ?? '-missing-label-'
  let shapeStyle: StyleProp<ViewStyle> = getShapeStyle(proto)
  let labelStyle: StyleProp<TextStyle> = getLabelStyle(proto)
  if (isDisabled) {
    shapeStyle = StyleSheet.compose(shapeStyle, exists(props.styleDisabled) ? props.styleDisabled : props.style)
    labelStyle = StyleSheet.compose(labelStyle, exists(props.labelStyleDisabled) ? props.labelStyleDisabled : props.labelStyle)
  } else {
    shapeStyle = StyleSheet.compose(shapeStyle, props.style)
    labelStyle = StyleSheet.compose(labelStyle, props.labelStyle)
  }
  const text = <Text style={labelStyle}>{title}</Text>
  if (isDisabled) {
    return <View style={shapeStyle}>{text}</View>
  }
  return <TouchableOpacity style={shapeStyle} onPress={props.onPress}>{text}</TouchableOpacity>
}
