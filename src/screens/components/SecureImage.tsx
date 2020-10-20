import React, { useState, useEffect } from 'react'
import { Image, ImageResizeMode, ImageStyle, Insets, View, StyleSheet, ViewStyle } from 'react-native'
import { readImageBlob } from '../../util/expoSecureBlobStore'
import { bufferToString, toBuffer } from '@consento/crypto/util/buffer'
import { elementSecureImage } from '../../styles/design/layer/elementSecureImage'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { composeAll } from '../../util/composeAll'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {}

export interface ISecretImage {
  secretKey: string | Uint8Array
  exif: Record<string, any>
  width: number
  height: number
}

export interface ISecureImageProps {
  image: ISecretImage
  resizeMode?: ImageResizeMode
  /**
   * The mechanism that should be used to resize the image when the image's dimensions differ from the image view's dimensions. Defaults to auto.
   *
   * - auto: Use heuristics to pick between resize and scale.
   * - resize: A software operation which changes the encoded image in memory before it gets decoded. This should be used instead of scale when the image is much larger than the view.
   * - scale: The image gets drawn downscaled or upscaled. Compared to resize, scale is faster (usually hardware accelerated) and produces higher quality images. This should be used if the image is smaller than the view. It should also be used if the image is slightly bigger than the view.
   *
   *  More details about resize and scale can be found at http://frescolib.org/docs/resizing-rotating.html.
   *
   * @platform — android
   */
  resizeMethod?: 'auto' | 'resize' | 'scale'
  style?: ViewStyle
  capInsets?: Insets
  orientation?: number
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: elementSecureImage.backgroundColor,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  },
  rotate90: {
    transform: [{ rotate: '90deg' }]
  },
  rotate180: {
    transform: [{ rotate: '180deg' }]
  },
  rotate270: {
    transform: [{ rotate: '270deg' }]
  }
})

interface ISize {
  width: number
  height: number
}

const resizeImpl: Record<ImageResizeMode, ((layout: ISize, computed: ISize) => { scaleX: number, scaleY: number })> = {
  cover: (layout, size) => {
    const compRatio = size.width / size.height
    const framRatio = layout.width / layout.height
    let scale: number
    if (compRatio > framRatio) {
      scale = layout.height / size.height
    } else {
      scale = layout.width / size.width
    }
    return { scaleX: scale, scaleY: scale }
  },
  contain: (layout, size) => {
    const compRatio = size.width / size.height
    const framRatio = layout.width / layout.height
    let scale: number
    if (compRatio > framRatio) {
      scale = layout.width / size.width
    } else {
      scale = layout.height / size.height
    }
    return { scaleX: scale, scaleY: scale }
  },
  stretch: (layout, size) => {
    return { scaleX: size.width / layout.width, scaleY: size.height / layout.height }
  },
  repeat: () => { throw new Error('not implemented') },
  center: (layout, size) => {
    if (size.width > layout.width || size.height > layout.height) {
      return resizeImpl.contain(layout, size)
    }
    return { scaleX: 1, scaleY: 1 }
  }
}

interface IImageStyle { layout: ISize, size: ISize, style: ImageStyle }

function createImageStyle (image: ISecretImage, layout: ISize, resizeMode?: ImageResizeMode): IImageStyle {
  const size: ISize = { width: image.width, height: image.height }
  const orientation = image.exif.Orientation ?? 0
  let style: ImageStyle = {}
  let is90deg = false
  if (orientation === 3) {
    style = styles.rotate180
  } else if (orientation === 6) {
    style = styles.rotate270
    is90deg = true
  } else if (orientation === 8) {
    style = styles.rotate90
    is90deg = true
  } // TODO: orientation 2, 4, 5 and 7 (flipped!) are uncommon but should probably be supported too.
  const resize = resizeImpl[resizeMode ?? 'cover'](layout, size)
  const scaled = {
    width: size.width * resize.scaleX,
    height: size.height * resize.scaleY
  }
  if (is90deg) {
    const flip = scaled.width
    scaled.width = scaled.height
    scaled.height = flip
  }
  return {
    style,
    layout,
    size: scaled
  }
}

export const SecureImage = ({ image, style, resizeMode, capInsets, resizeMethod }: ISecureImageProps): JSX.Element => {
  const [source, setSource] = useState<string>()
  const container = composeAll<ViewStyle>({ width: image.width, height: image.height }, styles.container, style)
  const [imageStyle, setImageStyle] = useState<IImageStyle | undefined>()
  useEffect(() => {
    let _setSource = setSource
    setSource(undefined)
    readImageBlob(toBuffer(image.secretKey))
      .then(uri => _setSource(uri))
      .catch(err => {
        // TODO: Display error on screen
        console.error(`Error Reading Image: ${String(err)}`)
      })
    return () => {
      _setSource = noop
    }
  }, [typeof image.secretKey === 'string' ? image.secretKey : bufferToString(image.secretKey)])
  return <View
    style={container}
    onLayout={event => {
      const { width, height } = event.nativeEvent.layout
      if (imageStyle === undefined || imageStyle.layout.width !== width || imageStyle.layout.height !== height) {
        setImageStyle(createImageStyle(image, { width, height }, resizeMode))
      }
    }}>
    {
      (imageStyle === undefined || source === undefined)
        ? <SketchElement src={elementSecureImage.layers.decrypting} />
        : <Image source={{ uri: source, ...imageStyle.size }} style={imageStyle.style} resizeMode='cover' resizeMethod={resizeMethod} capInsets={capInsets} />
    }
  </View>
}
