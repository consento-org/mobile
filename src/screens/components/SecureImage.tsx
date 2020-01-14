import React, { useState, useEffect } from 'react'
import { Image, View, ImageStyle, ImageResizeMode, ImageURISource, Insets } from 'react-native'
import { readImageBlob } from '../../util/expoSecureBlobStore'
import { toBuffer } from '@consento/crypto/util/buffer'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {}

export interface ISecretImage {
  secretKey: string | Uint8Array
  exif: { [key: string]: any }
  width: number
  height: number
}

export interface ISecureImageProps {
  secretKey: string | Uint8Array | ISecretImage
  loadingIndicatorSource?: ImageURISource
  resizeMode?: ImageResizeMode
  style?: ImageStyle
  capInsets?: Insets
}

export const SecureImage = ({ secretKey: input, style, resizeMode, loadingIndicatorSource, capInsets }: ISecureImageProps): JSX.Element => {
  let [source, setUri] = useState<ImageURISource>()
  useEffect(() => {
    let response = setUri
    let secretKey
    if (typeof input === 'string' || input instanceof Uint8Array) {
      secretKey = toBuffer(input)
    } else {
      secretKey = toBuffer(input.secretKey)
    }
    readImageBlob(secretKey)
      .then(image => {
        console.log({ imageBlob: image.substr(0, 32) })
        if (typeof input === 'string' || input instanceof Uint8Array) {
          response({
            uri: image
          })
        } else {
          response({
            uri: image,
            width: input.width,
            height: input.height
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
    return () => {
      response = noop
    }
  }, [input])

  if (source === undefined) {
    if (loadingIndicatorSource === undefined || loadingIndicatorSource === null) {
      return <View style={style} />
    }
    source = loadingIndicatorSource
  }
  return <Image source={source} style={style} resizeMode={resizeMode} />
}
