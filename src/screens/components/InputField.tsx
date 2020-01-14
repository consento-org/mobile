import React, { useRef } from 'react'
import { View, Text } from 'react-native'
import { elementFormInputField, ElementFormInputFieldClass } from '../../styles/component/elementFormInputField'
import { Link } from '../../styles/Component'
import { exists } from '../../util/exists'

export interface IInputTexts {
  inactive?: string
  label?: string
  caption?: string
}

export interface IInputFieldProps {
  autoFocus?: boolean
  proto?: Link<ElementFormInputFieldClass, IInputTexts>
  invalid?: boolean
  value: string
  defaultValue?: string
  onEdit(newValue: string): any
}

export const InputField = ({ value, defaultValue, onEdit, proto, autoFocus, invalid }: IInputFieldProps): JSX.Element => {
  const label = exists(proto) ? proto.text.label : null
  const caption = exists(proto) ? proto.text.caption : null
  if (!exists(defaultValue)) {
    defaultValue = exists(proto) ? proto.text.inactive : null
  }
  const ref = useRef<Text>()
  return <View style={{ height: elementFormInputField.caption.place.bottom, display: 'flex', top: proto.place.top, left: proto.place.left }}>
    {invalid
      ? <elementFormInputField.invalid.Render horz='stretch' />
      : <elementFormInputField.rectangle.Render horz='stretch' />}
    <elementFormInputField.cutout.Render />
    <elementFormInputField.label.Render value={label} />
    <elementFormInputField.caption.Render value={caption} />
    {value !== null
      ? <View>
        <elementFormInputField.active.Render
          onLayout={() => {
            if (autoFocus && ref.current !== null && ref.current !== undefined) {
              ref.current.focus()
            }
          }}
          selectTextOnFocus
          selection={{ start: 0 }}
          value={value}
          targetRef={ref}
          horz='stretch'
          onInstantEdit={(newName: string): void => { onEdit(newName) }}
        />
        {exists(defaultValue)
          ? <elementFormInputField.reset.Render
            style={{ zIndex: 1 }}
            onPress={() => { onEdit(null) }}
            horz='end' />
          : <View />}
      </View>
      : <elementFormInputField.inactive.Render value={defaultValue} onPress={() => onEdit('')} />}
  </View>
}
