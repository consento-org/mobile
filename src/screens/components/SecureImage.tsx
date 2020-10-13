import React, { useState, useEffect } from 'react'
import { Image, ImageResizeMode, ImageStyle, ImageURISource, Insets, View } from 'react-native'
import { readImageBlob } from '../../util/expoSecureBlobStore'
import { toBuffer } from '@consento/crypto/util/buffer'
import { elementSecureImage } from '../../styles/design/layer/elementSecureImage'
import { SketchElement } from '../../styles/util/react/SketchElement'

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
  const finalStyle = {
    backgroundColor: elementSecureImage.backgroundColor,
    ...style
  }
  useEffect(() => {
    let response = setUri
    const secretKey = (typeof input === 'string' || input instanceof Uint8Array)
      ? toBuffer(input)
      : toBuffer(input.secretKey)

    readImageBlob(secretKey)
      .then(image => {
        if (typeof input === 'string' || input instanceof Uint8Array) {
          response({ uri: image })
        } else {
          response({
            uri: image,
            width: input.width,
            height: input.height
          })
        }
      })
      .catch(err => {
        console.error(`Error Reading Image: ${String(err)}`)
      })
    return () => {
      response = noop
    }
  }, [input])

  if (source === undefined) {
    if (loadingIndicatorSource === undefined || loadingIndicatorSource === null) {
      return <View style={finalStyle}>
        <SketchElement src={elementSecureImage.layers.decrypting} />
      </View>
    }
    source = loadingIndicatorSource
  }
  return <Image source={source} style={finalStyle} resizeMode={resizeMode} capInsets={capInsets} />
}
