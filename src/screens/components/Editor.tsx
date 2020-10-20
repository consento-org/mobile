import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { File, FileType } from '../../model/VaultData'
import { useForm } from '../../util/useForm'
import { Vault } from '../../model/Vault'
import { DarkBar } from './DarkBar'
import { ScreenshotContext } from '../../util/screenshots'
import { elementTextEditor } from '../../styles/design/layer/elementTextEditor'
import { navigate } from '../../util/navigate'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { Color } from '../../styles/design/Color'
import { SketchTextBoxInput } from '../../styles/util/react/SketchTextBox'

const { saveSize, save, closeSize, title, size, close } = elementTextEditor.layers
const styleTitle = {
  marginTop: title.place.spaceY(closeSize.place),
  marginLeft: title.place.left,
  marginRight: title.place.right,
  height: title.place.height
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'stretch'
  },
  closeSize: {
    width: closeSize.place.width,
    height: closeSize.place.height
  },
  closeText: {
    marginTop: close.place.top,
    marginLeft: close.place.left
  },
  saveSize: {
    width: saveSize.place.width,
    height: saveSize.place.height
  },
  saveText: {
    marginTop: save.place.top,
    marginRight: save.place.right
  },
  topBar: {
    height: size.place.top + size.place.height
  },
  mainButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleInvalid: {
    ...styleTitle,
    color: Color.red
  },
  titleValid: styleTitle
})

export interface IEditorProps {
  file: File
  vault: Vault
  save?: (fields: { [key: string]: any }) => void | Promise<void>
  children?: React.ReactChild | React.ReactChild[]
}

export const Editor = ({ file, vault, children }: IEditorProps): JSX.Element => {
  const screenshots = useContext(ScreenshotContext)
  const insets = useSafeAreaInsets()
  const { Form, useStringField, save: handleSave, leave, isDirty, error } = useForm(
    undefined,
    (): void => navigate('vault', { vault: vault.$modelId })
  )
  if (error !== undefined) {
    console.log({ error })
  }
  const handleClose = (): void => leave()
  const filename = useStringField(
    'filename',
    file.name,
    (newName: string | null): boolean => {
      if (newName === null) return false
      if (newName === file.name) return true
      return vault.data?.isUnusedFilename(newName) ?? false
    },
    (newName: string | null): void => vault.data?.setFilename(file, newName ?? '' /* Note: it will never be '', as the validator makes sure that won't be the case */)
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
    <View style={styles.container}>
      <DarkBar height={insets.top} />
      <View style={styles.topBar}>
        <View style={styles.mainButtons}>
          <TouchableOpacity style={styles.closeSize} onPress={handleClose}>
            <SketchElement src={close} style={styles.closeText} />
          </TouchableOpacity>
          {
            isDirty
              ? <TouchableOpacity style={styles.saveSize} onPress={handleSave}>
                <SketchElement src={save} style={styles.saveText} />
              </TouchableOpacity>
              : <></>
          }
        </View>
        <SketchTextBoxInput
          src={title}
          onChangeText={filename.handleValue}
          style={filename.isInvalid ? styles.titleInvalid : styles.titleValid}>{filename.initial ?? undefined}</SketchTextBoxInput>
        {/* TODO: <SketchElement src={size} /> */}
      </View>
      {children}
    </View>
  </Form>
}
