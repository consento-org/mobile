import React, { useContext } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { elementTextEditor } from '../../styles/component/elementTextEditor'
import { useVUnits } from '../../styles/Component'
import { File, FileType } from '../../model/VaultData'
import { useForm } from '../../util/useForm'
import { observer } from 'mobx-react'
import { TNavigation } from '../navigation'
import { Vault } from '../../model/Vault'
import { Color } from '../../styles/Color'
import { DarkBar } from './DarkBar'
import { ScreenshotContext } from '../../util/screenshots'

const styles = StyleSheet.create({
  saveSize: {
    position: 'absolute',
    ...elementTextEditor.saveSize.place.style()
  },
  saveText: {
    ...elementTextEditor.save.style,
    top: elementTextEditor.save.place.top,
    left: 0,
    width: elementTextEditor.save.place.width
  },
  closeSize: {
    position: 'absolute',
    ...elementTextEditor.closeSize.place.style()
  }
})

export interface IEditorProps {
  file: File
  vault: Vault
  save?: (fields: { [key: string]: any }) => void | Promise<void>
  children?: React.ReactChild | React.ReactChild[]
  navigation: TNavigation
}

export const Editor = observer(({ navigation, file, vault, children }: IEditorProps): JSX.Element => {
  const { vh, vw } = useVUnits()
  const screenshots = useContext(ScreenshotContext)
  const { Form, useField, save, leave, isDirty } = useForm(navigation, undefined, (): any => navigation.navigate('vault', { vault: vault.$modelId }))
  const filename = useField(
    'filename',
    file.name,
    (newName: string): boolean => newName === file.name || vault.data.isUnusedFilename(newName),
    (newName: string): void => vault.data.setFilename(file, newName)
  )
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
    <View style={{ position: 'absolute', height: vh(100), width: '100%', top: 0, left: 0, display: 'flex', justifyContent: 'flex-start', alignContent: 'stretch' }}>
      <DarkBar />
      <View style={{ height: elementTextEditor.size.place.bottom }}>
        <TouchableOpacity style={styles.closeSize} onPress={() => leave(() => navigation.navigate('vault', { vault: vault.$modelId }))}>
          <elementTextEditor.close.Render />
        </TouchableOpacity>
        {
          isDirty
            ? <TouchableOpacity style={{ ...styles.saveSize, left: vw(100) - (elementTextEditor.width - elementTextEditor.save.place.left) }} onPress={save}>
              {elementTextEditor.save.render({ style: styles.saveText })}
            </TouchableOpacity>
            : <></>
        }
        <elementTextEditor.title.Render
          onInstantEdit={filename.handleValue}
          style={filename.isInvalid ? { color: Color.red } : undefined}
          value={filename.initial}
        />
        <elementTextEditor.size.Render />
      </View>
      <View
        style={{
          flexGrow: 1
        }}
      >{children}</View>
    </View>
  </Form>
})
