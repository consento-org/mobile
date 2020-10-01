import React, { useEffect, useRef, useState } from 'react'
import { View, TextInput, ViewStyle, StyleSheet, ImageStyle, TouchableWithoutFeedback } from 'react-native'
import { elementFormInputField } from '../../styles/design/layer/elementFormInputField'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { SketchPolygon } from '../../styles/util/react/SketchPolygon'
import { SketchTextBoxInput } from '../../styles/util/react/SketchTextBox'
import { composeAll } from '../../util/composeAll'

export interface IInputTexts {
  inactive?: string
  label?: string
  caption?: string
}

export interface IInputFieldProto {
  place: {
    top?: number
    left?: number
  }
  layers: {
    label: { text: string }
    caption: { text: string }
    inactive: { text: string }
  }
}

export interface IInputFieldProps {
  autoFocus?: boolean
  proto?: IInputFieldProto
  invalid?: boolean
  value: string | null
  defaultValue?: string | null
  onEdit: (newValue: string | null) => any
  style?: ViewStyle
}

const { caption: captionTextBox, rectangle, invalid: invalidRect, cutout, label: labelTextBox, active, reset, inactive } = elementFormInputField.layers

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: elementFormInputField.place.height,
    width: elementFormInputField.place.width
  },
  bg: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'stretch',
    alignItems: 'stretch'
  },
  rectangle: {
    marginLeft: rectangle.place.left,
    marginTop: rectangle.place.top,
    marginRight: rectangle.place.right,
    marginBottom: rectangle.place.bottom,
    flexGrow: 1,
    flexShrink: 0
  },
  labelBox: {
    position: 'absolute',
    backgroundColor: cutout.fill.color,
    left: cutout.place.left,
    height: cutout.place.height,
    paddingTop: cutout.place.top + 1,
    paddingLeft: labelTextBox.place.left - cutout.place.left,
    paddingRight: cutout.place.left + cutout.place.width - labelTextBox.place.left - labelTextBox.place.width
  },
  captionBox: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    alignContent: 'stretch',
    top: captionTextBox.place.top
  },
  caption: {
    marginLeft: captionTextBox.place.left,
    marginRight: captionTextBox.place.right
  },
  inputBox: {
    position: 'absolute',
    top: active.place.top,
    width: '100%',
    paddingLeft: active.place.left,
    paddingRight: active.place.right
  },
  reset: {
    position: 'absolute',
    right: reset.place.right,
    top: reset.place.top
  },
  invisible: {
    // TODO: display: none didn't work, weird right?
    width: 0,
    height: 0,
    overflow: 'hidden'
  },
  inactiveTouchArea: {
    width: '100%',
    height: '100%'
  }
})

export const InputField = ({ value, defaultValue, onEdit, proto, invalid, style, autoFocus }: IInputFieldProps): JSX.Element => {
  defaultValue = defaultValue ?? proto?.layers.inactive.text
  const label = proto?.layers.label.text
  const caption = proto?.layers.caption.text
  const ref = useRef<TextInput>(null)
  const containerStyle = composeAll<ViewStyle>(styles.container, { top: proto?.place.top, left: proto?.place.left }, style)
  const [focused, setFocused] = useState(false)
  const hasValue = value !== null && value !== ''
  const styleActive = focused || hasValue ? null : styles.invisible
  const styleInactive = !hasValue ? null : styles.invisible
  const [handleRequestFocus] = useState(() => (): void => {
    if (value === undefined) {
      onEdit('')
    }
    ref.current?.focus()
  })
  const handleFocus = (): void => setFocused(true)
  const handleBlur = (): void => setFocused(false)
  useEffect(() => {
    if (autoFocus === true) {
      // Need timeout as it is run before the reference is filled
      setTimeout(handleRequestFocus, 1)
    }
    return () => {}
  }, [autoFocus])
  return <View style={containerStyle}>
    <View style={styles.bg}>
      <SketchPolygon src={invalid === true ? invalidRect : rectangle} style={styles.rectangle} />
    </View>
    <View style={styles.labelBox}>
      <SketchElement src={labelTextBox} value={label} />
    </View>
    <View style={styles.captionBox}>
      <SketchElement src={captionTextBox} value={caption} style={styles.caption} />
    </View>
    <View style={composeAll<ViewStyle>(styles.inputBox, styleInactive)}>
      <SketchElement src={inactive} value={defaultValue} />
    </View>
    <View style={composeAll<ViewStyle>(styles.inputBox, styleActive)}>
      <SketchTextBoxInput
        src={active}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        selectTextOnFocus
        defaultValue={value ?? ''}
        onChangeText={(newName: string): void => { onEdit(newName) }}
      />
    </View>
    <TouchableWithoutFeedback onPress={handleRequestFocus}>
      <View style={composeAll<ViewStyle>(styles.inactiveTouchArea, styleInactive)} />
    </TouchableWithoutFeedback>
    <SketchElement src={reset} style={composeAll<ImageStyle>(styles.reset, styleActive)} onPress={() => { onEdit(null) }} />
  </View>
}
