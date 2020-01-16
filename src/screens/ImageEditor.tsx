import React from 'react'
import { Editor } from './components/Editor'
import { ImageFile } from '../model/VaultData'
import { SecureImage } from './components/SecureImage'

export interface IImageEditorProps {
  image: ImageFile
}

export const ImageEditor = ({ image }: IImageEditorProps): JSX.Element => {
  return <Editor file={image}>
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
