import React from 'react'
import { Editor } from './components/Editor'
import { ImageFile } from '../model/VaultData'
import { SecureImage } from './components/SecureImage'
import { Vault } from '../model/Vault'
import { TNavigation } from './navigation'

export interface IImageEditorProps {
  image: ImageFile
  vault: Vault
  navigation: TNavigation
}

export const ImageEditor = ({ image, vault, navigation }: IImageEditorProps): JSX.Element => {
  return <Editor file={image} vault={vault} navigation={navigation}>
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
