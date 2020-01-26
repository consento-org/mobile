import React, { useContext } from 'react'
import { View, ViewStyle, TouchableOpacity, Text } from 'react-native'
import { elementTextEditor } from '../../styles/component/elementTextEditor'
import { useVUnits } from '../../styles/Component'
import { useSafeArea } from 'react-native-safe-area-context'
import { ContextMenuContext } from './ContextMenu'
import { File, FileType } from '../../model/VaultData'
import { useForm } from '../../util/useForm'
import { observer } from 'mobx-react'
import { TNavigation } from '../navigation'
import { Vault } from '../../model/Vault'
import { Color } from '../../styles/Color'
import { DarkBar } from './DarkBar'
import { ScreenshotContext } from '../../util/screenshots'

const saveSize: ViewStyle = {
  position: 'absolute',
  ...elementTextEditor.saveSize.place.style()
}

const editSize: ViewStyle = {
  position: 'absolute',
  ...elementTextEditor.editSize.place.style()
}

const closeSize: ViewStyle = {
  position: 'absolute',
  ...elementTextEditor.closeSize.place.style()
}

export interface IEditorProps {
  file: File
  vault: Vault
  save?: (fields: { [key: string]: any }) => void | Promise<void>
  children?: React.ReactChild | React.ReactChild[]
  navigation: TNavigation
}

export const Editor = observer(({ navigation, file, vault, children }: IEditorProps): JSX.Element => {
  const { vh, vw } = useVUnits()
  const { open } = useContext(ContextMenuContext)
  const screenshots = useContext(ScreenshotContext)
  const { Form, useField, save, leave, isDirty } = useForm(navigation, undefined, (): any => navigation.navigate('vault', { vault: vault.$modelId }))
  const filename = useField(
    'filename',
    file.name,
    (newName: string): boolean => newName === file.name || vault.data.isUnusedFilename(newName),
    (newName: string): void => vault.data.setFilename(file, newName)
  )
  const insets = useSafeArea()

  if (!isDirty) {
    if (!/^Untitled-/.test(file.name)) {
      if (file.type === FileType.image) {
        screenshots.vaultImageEditor.takeSync(200)
      } else {
        screenshots.vaultTextEditor.takeSync(200)
      }
    }
  }

  return <Form>
    <DarkBar />
    <View style={{ position: 'absolute', top: insets.top, height: vh(100) - insets.top, width: '100%' }}>
      <TouchableOpacity style={closeSize} onPress={() => leave(() => navigation.navigate('vault', { vault: vault.$modelId }))}>
        <elementTextEditor.close.Render />
      </TouchableOpacity>
      {
        isDirty
          ? <TouchableOpacity style={saveSize} onPress={save}>
            {elementTextEditor.save.render({ style: { left: elementTextEditor.save.place.left - elementTextEditor.saveSize.place.left, top: elementTextEditor.save.place.top - elementTextEditor.saveSize.place.top } })}
          </TouchableOpacity>
          : <></>
      }
      <TouchableOpacity style={{ ...editSize, left: vw(100) - (elementTextEditor.width - elementTextEditor.edit.place.left) }} onPress={event => open([], null, event)}>
        <Text style={{ ...elementTextEditor.edit.style, top: elementTextEditor.edit.place.top }}>{elementTextEditor.edit.text}</Text>
      </TouchableOpacity>
      <elementTextEditor.title.Render
        onInstantEdit={filename.handleValue}
        style={filename.isInvalid ? { color: Color.red } : undefined}
        value={filename.initial}
      />
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
  </Form>
})
