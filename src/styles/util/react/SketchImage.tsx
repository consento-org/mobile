// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import React, { forwardRef } from 'react'
import { Image, ImageStyle, ImageProps, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, StyleSheet, GestureResponderEvent } from 'react-native'
import { IImageAsset, ISketchElementProps } from '../types'
import { extract } from '../lang'

export interface ISketchImageProps extends
  ISketchElementProps<IImageAsset>,
  Omit<ImageProps, 'source'>,
  Omit<TouchableWithoutFeedbackProps, 'style'> {
  onPress?: (event: GestureResponderEvent) => void
}

export const SketchImage = forwardRef<Image, ISketchImageProps>((props, ref): JSX.Element => {
  /* eslint-disable react/prop-types */
  props = { ...props } // make a copy
  const { src } = extract(props, 'src')
  const touchable: TouchableWithoutFeedbackProps = extract(props, 'disabled', 'onPress', 'onPressIn', 'onPressOut', 'onLongPress', 'delayPressIn', 'delayPressOut', 'delayLongPress')

  const imageProps: ImageProps = {
    ...props,
    source: src.source(),
    style: StyleSheet.compose<ImageStyle>({ width: src.place.width, height: src.place.height }, props.style)
  }
  const isTouchable = Object.keys(touchable).length > 0 && (touchable.disabled === undefined || touchable.disabled === null || !touchable.disabled)
  if (isTouchable) {
    return <TouchableWithoutFeedback {...touchable}><Image {...imageProps} ref={ref} /></TouchableWithoutFeedback>
  }
  return <Image {...imageProps} ref={ref} />
})
