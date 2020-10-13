import React from 'react'
import { Editor } from './components/Editor'
import { ImageFile } from '../model/VaultData'
import { SecureImage } from './components/SecureImage'
import { Vault } from '../model/Vault'

export interface IImageEditorProps {
  image: ImageFile
  vault: Vault
}

export const ImageEditor = ({ image, vault }: IImageEditorProps): JSX.Element => {
  return <Editor file={image} vault={vault}>
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
