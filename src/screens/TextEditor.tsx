import React, { useContext } from 'react'
import { TextInput, Text } from 'react-native'
import { elementTextEditor } from '../styles/component/elementTextEditor'
import { Editor } from './components/Editor'
import { TextFile } from '../model/VaultData'
import { Vault } from '../model/Vault'
import { TNavigation } from './navigation'
import { FormContext } from '../util/useForm'

export interface ITextEditorProps {
  textFile: TextFile
  vault: Vault
  navigation: TNavigation
}

interface IInputProps {
  file: TextFile
}

const inputStyle = {
  width: '100%',
  height: '100%',
  paddingLeft: elementTextEditor.readable.place.left,
  paddingRight: elementTextEditor.width - elementTextEditor.readable.place.right,
  ...elementTextEditor.readable.style
}

const loadingStyle = {
  left: elementTextEditor.readable.place.left,
  ...elementTextEditor.readable.style
}

const Input = ({ file }: IInputProps): JSX.Element => {
  const { useStringField } = useContext(FormContext)
  const fullText = useStringField(
    'fullText',
    async () => await file.loadText(),
    () => true,
    async newText => await file.saveText(newText)
  )
  if (!fullText.loaded) {
    return <Text style={loadingStyle}>Loading...</Text>
  }
  return <TextInput ref={input => input?.focus()} style={inputStyle} onChangeText={fullText.handleValue} defaultValue={fullText.initial} editable multiline />
}

export const TextEditor = ({ textFile, vault, navigation }: ITextEditorProps): JSX.Element => {
  return <Editor file={textFile} vault={vault} navigation={navigation}><Input file={textFile} /></Editor>
}
