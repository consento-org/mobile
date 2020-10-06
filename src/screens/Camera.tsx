import React, { useEffect, useRef, useState } from 'react'
import { View, useWindowDimensions, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, GestureResponderEvent, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ImageFile } from '../model/VaultData'
import { Camera as NativeCamera } from 'expo-camera'
import { IImageAsset, IPolygon } from '../styles/util/types'
import { ImageAsset } from '../styles/design/ImageAsset'
import { elementCamera } from '../styles/design/layer/elementCamera'
import { SketchImage } from '../styles/util/react/SketchImage'
import { ImagePlacement } from '../styles/util/ImagePlacement'
import { CameraContainer } from './components/CameraContainer'
import { SketchElement } from '../styles/util/react/SketchElement'
import { importFile } from '../util/expoSecureBlobStore'
import { bufferToString } from '@consento/api/util'

const ShutterButton = ({ onPress }: { onPress: () => any }): JSX.Element => {
  const [pressed, setPressed] = useState<boolean>(false)

  return <SketchImage
    src={pressed ? elementCamera.layers.shutterActive : elementCamera.layers.shutter}
    onPress={onPress}
    onPressIn={() => setPressed(true)}
    onPressOut={() => setPressed(false)}
  />
}

type IFlatButton = (props: { onPress: () => any }) => JSX.Element

function createFlatButton ({ item, pressed: poly }: {
  item: ImagePlacement
  pressed: IPolygon
}): IFlatButton {
  const basicStyle: ViewStyle = {
    width: poly.place.width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
  const buttonStyles = StyleSheet.create({
    normal: {
      ...basicStyle
    },
    pressed: {
      ...basicStyle,
      backgroundColor: poly.fill.color
    }
  })
  return ({ onPress }: { onPress: (event: GestureResponderEvent) => void }) => {
    const [pressed, setPressed] = useState<boolean>(false)
    return <TouchableWithoutFeedback
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <View style={pressed ? buttonStyles.pressed : buttonStyles.normal}><SketchImage src={item} /></View>
    </TouchableWithoutFeedback>
  }
}

const { bg, image, closeSize, close, encryptingBg } = elementCamera.layers

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonBar: {
    display: 'flex',
    flexDirection: 'row',
    height: bg.place.height - (elementCamera.place.height - image.place.height),
    backgroundColor: bg.fill.color
  },
  encryptingOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: encryptingBg.fill.color
  },
  shutterButton: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  close: {
    position: 'absolute',
    zIndex: 1,
    left: closeSize.place.left,
    top: closeSize.place.top,
    width: closeSize.place.width,
    height: closeSize.place.height,
    paddingLeft: close.place.left - closeSize.place.left,
    paddingTop: close.place.top - closeSize.place.top
  },
  topBar: {
    alignItems: 'center',
    alignSelf: 'stretch'
  }
})

const MinusButton = createFlatButton({ item: elementCamera.layers.minus, pressed: elementCamera.layers.minusBg })
const PlusButton = createFlatButton({ item: elementCamera.layers.plus, pressed: elementCamera.layers.minusBg })
const FlipButton = createFlatButton({ item: elementCamera.layers.flip, pressed: elementCamera.layers.flipBg })

export interface ICameraProps {
  onPicture: (capture: ImageFile) => void
  onClose: () => void
}

export const Camera = ({ onPicture, onClose }: ICameraProps): JSX.Element => {
  const [flashMode, setFlashMode] = useState<boolean>(NativeCamera.Constants.FlashMode.off)
  const [direction, setDirection] = useState(NativeCamera.Constants.Type.back)
  const [zoom, setZoom] = useState<number>(0)
  const [isEncrypting, setEncrypting] = useState<boolean>(false)
  const ref = useRef<NativeCamera>()

  const flip = (): void => {
    setDirection(
      direction === NativeCamera.Constants.Type.front
        ? NativeCamera.Constants.Type.back
        : NativeCamera.Constants.Type.front
    )
  }
  const zoomOut = (): void => {
    setZoom(Math.max(zoom - 0.025, 0))
  }

  const zoomIn = (): void => {
    setZoom(Math.min(zoom + 0.025, 1))
  }

  useEffect(() => {
    if (!isEncrypting) {
      return
    }
    (async (): Promise<void> => {
      const camera = ref.current
      if (camera === undefined) {
        throw new Error('Cant be: there is no camera!!1')
      }
      const capture = await camera.takePictureAsync({
        quality: 0.4,
        exif: true
      })
      const blob = await importFile(capture.uri, true)
      setEncrypting(false)
      onPicture(new ImageFile({
        name: capture.uri.substr(capture.uri.lastIndexOf('/') + 1),
        secretKeyBase64: bufferToString(blob.secretKey, 'base64'),
        width: capture.width,
        height: capture.height,
        exif: capture.exif
      }))
    })().catch(err => {
      setEncrypting(false)
      console.error(err)
    })
  }, [isEncrypting])

  const takePic = (): void => {
    if (ref.current === null) {
      console.log('Warn: Error while trying to take picture: reference is not properly set!')
      return
    }
    setEncrypting(true)
  }

  const toggleFlash = (): void => {
    if (flashMode === NativeCamera.Constants.FlashMode.on) {
      return setFlashMode(NativeCamera.Constants.FlashMode.torch)
    }
    if (flashMode === NativeCamera.Constants.FlashMode.torch) {
      return setFlashMode(NativeCamera.Constants.FlashMode.off)
    }
    return setFlashMode(NativeCamera.Constants.FlashMode.on)
  }

  const flash: IImageAsset = flashMode === NativeCamera.Constants.FlashMode.on
    ? ImageAsset.iconCameraFlashAuto
    : flashMode === NativeCamera.Constants.FlashMode.torch
      ? ImageAsset.iconCameraFlashOn
      : ImageAsset.iconCameraFlashOff

  const window = useWindowDimensions()
  const inset = useSafeAreaInsets()
  return <>
    <CameraContainer style={{ width: window.width, height: window.height }} zoom={zoom} type={direction} ref={ref} flashMode={flashMode} />
    <View style={styles.container}>
      <View style={StyleSheet.compose<ViewStyle>(styles.topBar, { marginTop: inset.top })}>
        <SketchImage src={flash} onPress={toggleFlash} />
        <TouchableOpacity onPress={onClose} style={styles.close}>
          <View>
            <SketchElement src={elementCamera.layers.close} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonBar}>
        <MinusButton onPress={zoomOut} />
        <PlusButton onPress={zoomIn} />
        <View style={styles.shutterButton}>
          <ShutterButton onPress={takePic} />
        </View>
        <FlipButton onPress={flip} />
      </View>
      {
        isEncrypting
          ? <View style={styles.encryptingOverlay}>
            <SketchElement src={elementCamera.layers.encryptingText} />
          </View>
          : <></>
      }
    </View>
  </>
}
