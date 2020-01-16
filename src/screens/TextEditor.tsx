import React from 'react'
import { TextInput } from 'react-native'
import { elementTextEditor } from '../styles/component/elementTextEditor'
import { Editor } from './components/Editor'
import { TextFile } from '../model/VaultData'

export interface ITextEditorProps {
  textFile: TextFile
}

export const TextEditor = ({ textFile }: ITextEditorProps): JSX.Element => {
  return <Editor file={textFile}>
    <TextInput
      style={{
        width: '100%',
        height: '100%',
        paddingLeft: elementTextEditor.readable.place.left,
        paddingRight: elementTextEditor.width - elementTextEditor.readable.place.right,
        ...elementTextEditor.readable.style
      }}
      multiline
      defaultValue='todo'
      selection={{ start: 0 }}
      editable
    />
  </Editor>
}
