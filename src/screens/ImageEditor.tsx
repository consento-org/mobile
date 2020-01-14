import React from 'react'
import { Image } from 'react-native'
import { Editor } from './components/Editor'
import { IImage } from '../model/Vault'

export interface IImageEditorProps {
  image: IImage
}

export const ImageEditor = ({ image }: IImageEditorProps): JSX.Element => {
  return <Editor>
    <Image
      source={{ uri: image.uri }}
      resizeMode='contain'
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  </Editor>
}
