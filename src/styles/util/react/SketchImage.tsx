// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import React from 'react'
import { Image, ImageStyle, ImageProps, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, StyleSheet } from 'react-native'
import { IImageAsset, ISketchElementProps } from '../types'
import { extract } from '../lang'

export interface ISketchImageProps extends
  ISketchElementProps<IImageAsset>,
  Omit<ImageProps, 'source'>,
  Omit<TouchableWithoutFeedbackProps, 'style'> {
  ref?: React.Ref<Image>
  onPress?: () => void
}

export const SketchImage = (props: ISketchImageProps): JSX.Element => {
  props = { ...props }
  const { src, style } = extract(props, 'src', 'style')
  const touchable: TouchableWithoutFeedbackProps = extract(props, 'disabled', 'onPress', 'onPressIn', 'onPressOut', 'onLongPress', 'delayPressIn', 'delayPressOut', 'delayLongPress')

  const imageProps: ImageProps = {
    ...props,
    source: src.source(),
    style: StyleSheet.compose<ImageStyle>({ width: src.place.width, height: src.place.height }, style)
  }
  const isTouchable = Object.keys(touchable).length > 0 && (touchable.disabled === undefined || touchable.disabled === null || !touchable.disabled)
  if (isTouchable) {
    return React.createElement(TouchableWithoutFeedback, touchable, React.createElement(Image, imageProps))
  }
  return React.createElement(Image, imageProps)
}
