import React from 'react'
import { StyleSheet } from 'react-native'
import { Editor } from './components/Editor'
import { ImageFile } from '../model/VaultData'
import { SecureImage } from './components/SecureImage'
import { Vault } from '../model/Vault'

export interface IImageEditorProps {
  image: ImageFile
  vault: Vault
}

const styles = StyleSheet.create({
  image: {
    flexGrow: 1,
    alignSelf: 'stretch',
    height: 'auto',
    width: 'auto'
  }
})

export const ImageEditor = ({ image, vault }: IImageEditorProps): JSX.Element => {
  return <Editor file={image} vault={vault}>
    <SecureImage
      image={image}
      resizeMode='contain'
      style={styles.image}
    />
  </Editor>
}
