import React from 'react'
import { Editor } from './components/Editor'
import { IImage } from '../model/Vault'
import { SecureImage } from './components/SecureImage'

export interface IImageEditorProps {
  image: IImage
}

export const ImageEditor = ({ image }: IImageEditorProps): JSX.Element => {
  return <Editor>
    <SecureImage
      secretKey={image}
      resizeMode='contain'
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  </Editor>
}
