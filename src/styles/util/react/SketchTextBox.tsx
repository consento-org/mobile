// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import React, { forwardRef } from 'react'
import { Text, TextInput, TextProps, TextInputProps, StyleSheet } from 'react-native'
import { exists } from '../lang'
import { ISketchElementProps, ITextBox } from '../types'

export interface ISketchTextBoxViewProps extends ISketchElementProps<ITextBox>, TextProps {
  children?: string
  value?: string
}

export interface ISketchTextBoxInputProps extends ISketchElementProps<ITextBox>, TextInputProps {
  children?: string
}

export type ISketchTextBoxProps = ISketchTextBoxInputProps | ISketchTextBoxViewProps

export const SketchTextBoxView = forwardRef<Text, ISketchTextBoxViewProps>((props, ref): JSX.Element => {
  /* eslint-disable react/prop-types */
  const { text } = props.src
  const style = exists(props.style) ? StyleSheet.compose(props.src.style, props.style) : props.src.style
  return <Text {...props} ref={ref} style={style}>{
    props.value ?? props.children ?? text
  }</Text>
})

export const SketchTextBoxInput = forwardRef<TextInput, ISketchTextBoxInputProps>((props, ref): JSX.Element => {
  /* eslint-disable react/prop-types */
  const style = exists(props.style) ? StyleSheet.compose(props.src.style, props.style) : props.src.style
  return <TextInput {...props} ref={ref} style={style} />
})

export function isSketchTextBoxInputProps (props: ISketchTextBoxProps): props is ISketchTextBoxInputProps {
  for (const missing of ['onLayout', 'onTextLayout', 'onPress', 'onLongPress']) {
    if (missing in props) {
      return false
    }
  }

  for (const identifying of ['editable', 'autoCapitalize', 'autoCorrect', 'autoFocus', 'blurOnSubmit',
    'caretHidden', 'contextMenuHidden', 'defaultValue', 'ellipsizeMode', 'numberOfLines', 'keyboardType',
    'lineBreakMode', 'maxLength', 'multiline', 'onBlur', 'onChange', 'onChangeText', 'onContentSizeChange',
    'onEndEditing', 'onFocus', 'onSelectionChange', 'onSubmitEditing', 'onTextInput', 'onScroll',
    'onKeyPress', 'placeholder', 'placeholderTextColor', 'returnKeyType', 'secureTextEntry',
    'selectTextOnFocus', 'selection', 'selectionColor', 'inputAccessoryViewID']) {
    if (identifying in props) {
      return true
    }
  }
  return false
}

export interface ISketchTextBox {
  (props: ISketchTextBoxInputProps & { ref?: React.Ref<TextInput> }): JSX.Element
  (props: ISketchTextBoxViewProps & { ref?: React.Ref<Text> }): JSX.Element
}

export const SketchTextBox: ISketchTextBox = forwardRef<Text | TextInput, ISketchTextBoxProps>((props, ref): JSX.Element => {
  if (isSketchTextBoxInputProps(props)) {
    return <SketchTextBoxInput {...props} ref={ref as React.Ref<TextInput>} />
  }
  return <SketchTextBoxView {...props} ref={ref as React.Ref<Text>} />
}) as ISketchTextBox
