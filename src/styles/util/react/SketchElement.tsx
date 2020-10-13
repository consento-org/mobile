// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import React, { forwardRef, Ref } from 'react'
import { isImageAsset, ISketchElementProps, isImagePlacement, isTextBox, isSlice9Placement, isSlice9 } from '../types'
import { ISketchImageProps, SketchImage } from './SketchImage'
import { ISketchTextBoxInputProps, ISketchTextBoxProps, ISketchTextBoxViewProps, isSketchTextBoxInputProps, SketchTextBoxInput, SketchTextBoxView } from './SketchTextBox'
import { ISketchSlice9Props, SketchSlice9 } from './SketchSlice9'
import { ISketchPolygonProps, SketchPolygon } from './SketchPolygon'
import { Text, TextInput, View, Image } from 'react-native'

function isImageProps (props: ISketchElementProps<any>): props is ISketchImageProps {
  return isImageAsset(props.src) || isImagePlacement(props.src)
}

function isTextBoxProps (props: ISketchElementProps<any>): props is ISketchTextBoxProps {
  return isTextBox(props.src)
}

function isSlice9Props (props: ISketchElementProps<any>): props is ISketchSlice9Props {
  return isSlice9(props.src) || isSlice9Placement(props.src)
}

export interface ISketchElement {
  (props: ISketchImageProps & { ref?: Ref<Image> }): JSX.Element
  (props: ISketchPolygonProps & { ref?: Ref<View> }): JSX.Element
  (props: ISketchSlice9Props & { ref?: Ref<View> }): JSX.Element
  (props: ISketchTextBoxViewProps & { ref?: Ref<Text> }): JSX.Element
  (props: ISketchTextBoxInputProps & { ref?: Ref<TextInput> }): JSX.Element
}

export const SketchElement: ISketchElement = forwardRef<Text | TextInput | View | Image, ISketchImageProps | ISketchTextBoxProps | ISketchSlice9Props | ISketchPolygonProps>((props, ref): JSX.Element => {
  if (isImageProps(props)) {
    return <SketchImage {...props} ref={ref as Ref<Image>} />
  }
  if (isTextBoxProps(props)) {
    if (isSketchTextBoxInputProps(props)) {
      return <SketchTextBoxInput {...props} ref={ref as Ref<TextInput>} />
    }
    return <SketchTextBoxView {...props} ref={ref as Ref<Text>} />
  }
  if (isSlice9Props(props)) {
    return <SketchSlice9 {...props} ref={ref as Ref<View>} />
  }
  return <SketchPolygon {...props} ref={ref as Ref<View>} />
}) as ISketchElement
