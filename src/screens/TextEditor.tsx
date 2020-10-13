import React, { useContext } from 'react'
import { TextInput, Text, StyleSheet } from 'react-native'
import { Editor } from './components/Editor'
import { TextFile } from '../model/VaultData'
import { Vault } from '../model/Vault'
import { FormContext } from '../util/useForm'
import { assertExists } from '../util/assertExists'
import { elementTextEditor } from '../styles/design/layer/elementTextEditor'

export interface ITextEditorProps {
  textFile: TextFile
  vault: Vault
}

interface IInputProps {
  file: TextFile
}

const styles = StyleSheet.create({
  input: {
    flexGrow: 1,
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    paddingLeft: elementTextEditor.layers.readable.place.left,
    paddingRight: elementTextEditor.layers.readable.place.right,
    paddingBottom: elementTextEditor.layers.readable.place.bottom
  },
  loading: {
    marginLeft: elementTextEditor.layers.readable.place.left
  }
})

const Input = ({ file }: IInputProps): JSX.Element => {
  const form = useContext(FormContext)
  assertExists(form)
  const { useStringField } = form
  const { loaded, handleValue, initial } = useStringField(
    'fullText',
    async () => await file.loadText(),
    () => true,
    async newText => await file.saveText(newText ?? '')
  )
  if (!loaded) {
    return <Text style={styles.loading}>Loading...</Text>
  }
  return <TextInput autoFocus style={styles.input} onChangeText={handleValue} editable multiline>{initial}</TextInput>
}

export const TextEditor = ({ textFile, vault }: ITextEditorProps): JSX.Element => {
  return <Editor file={textFile} vault={vault}><Input file={textFile} /></Editor>
}
