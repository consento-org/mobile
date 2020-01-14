import React, { useContext } from 'react'
import { View, ViewStyle, TouchableOpacity, Text } from 'react-native'
import { elementTextEditor } from '../../styles/component/elementTextEditor'
import { useVUnits } from '../../util/useVUnits'
import { useSafeArea } from 'react-native-safe-area-context'
import { ContextMenuContext } from './ContextMenu'

const saveSize: ViewStyle = {
  position: 'absolute',
  ...elementTextEditor.saveSize.place.style()
}

const editSize: ViewStyle = {
  position: 'absolute',
  ...elementTextEditor.editSize.place.style()
}

export const Editor = ({ children }: { children?: React.ReactChild | React.ReactChild[] }): JSX.Element => {
  const { vh, vw } = useVUnits()
  const { open } = useContext(ContextMenuContext)
  const insets = useSafeArea()

  return <View style={{ position: 'absolute', top: insets.top, height: vh(100) - insets.top, width: '100%' }}>
    <TouchableOpacity style={saveSize}>
      <elementTextEditor.save.Render />
    </TouchableOpacity>
    <TouchableOpacity style={{ ...editSize, left: vw(100) - (elementTextEditor.width - elementTextEditor.edit.place.left) }} onPress={event => open([], null, event)}>
      <Text style={{ ...elementTextEditor.edit.style, top: elementTextEditor.edit.place.top }}>{elementTextEditor.edit.text}</Text>
    </TouchableOpacity>
    <elementTextEditor.title.Render onEdit={() => null} targetRef={(textInput) => textInput?.focus()} selectable />
    <elementTextEditor.size.Render />
    <View
      style={{
        position: 'absolute',
        top: elementTextEditor.readable.place.top,
        height: vh(100) - insets.top - elementTextEditor.readable.place.top - insets.bottom,
        width: '100%'
      }}
    >{children}</View>
  </View>
}