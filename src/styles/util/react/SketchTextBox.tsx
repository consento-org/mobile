// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import React from 'react'
import { Text, TextInput, TextProps, TextInputProps, StyleSheet } from 'react-native'
import { exists } from '../lang'
import { ISketchElementProps, ITextBox } from '../types'

export interface ISketchTextBoxViewProps extends
  ISketchElementProps<ITextBox>,
  TextProps {
  ref?: React.Ref<Text>
  children?: string
  value?: string
}

export interface ISketchTextBoxInputProps extends
  ISketchElementProps<ITextBox>,
  TextInputProps {
  ref?: React.Ref<TextInput>
  children?: string
}

export type ISketchTextBoxProps = ISketchTextBoxInputProps | ISketchTextBoxViewProps

export const SketchTextBoxView = (props: ISketchTextBoxViewProps): JSX.Element => {
  const { text } = props.src
  const textProps: TextProps = {
    ...props,
    style: exists(props.style) ? StyleSheet.compose(props.src.style, props.style) : props.src.style
  }
  return React.createElement(Text, textProps, props.value ?? props.children ?? text)
}

export const SketchTextBoxInput = (props: ISketchTextBoxInputProps): JSX.Element => {
  return React.createElement(TextInput, {
    ...props,
    style: exists(props.style) ? StyleSheet.compose(props.src.style, props.style) : props.src.style
  })
}

function isSketchTextBoxInputProps (props: ISketchTextBoxProps): props is ISketchTextBoxInputProps {
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

export const SketchTextBox = (props: ISketchTextBoxProps): JSX.Element => {
  if (isSketchTextBoxInputProps(props)) {
    return SketchTextBoxInput(props)
  }
  return SketchTextBoxView(props)
}
