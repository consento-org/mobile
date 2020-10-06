import React from 'react'
import { View } from 'react-native'

export const Camera = (): JSX.Element => {
  return <View />
}
/*
import React, { useState, useRef, useEffect } from 'react'
import { CameraContainer } from './components/CameraContainer'
import { ViewStyle, View } from 'react-native'
import { Camera as NativeCamera } from 'expo-camera'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler'
import { ImageFile } from '../model/VaultData'
import { importFile } from '../util/expoSecureBlobStore'
import { bufferToString } from '@consento/crypto/util/buffer'
import { IImageAsset } from '../styles/util/types'
import { SketchImage } from '../styles/util/react/SketchImage'
import { elementCamera } from '../styles/design/layer/elementCamera'
import { ImagePlacement } from '../styles/util/ImagePlacement'
import { Polygon } from '../styles/util/Polygon'
import { SketchElement } from '../styles/util/react/SketchElement'

const containerStyle: ViewStyle = {
  backgroundColor: elementCamera.backgroundColor,
  width: '100%',
  height: '100%',
  position: 'absolute',
  display: 'flex'
}

const ShutterButton = ({ onPress }: { onPress: () => any }): JSX.Element => {
  const [pressed, setPressed] = useState<boolean>(false)

  return <SketchImage
    src={pressed ? elementCamera.layers.shutterActive : elementCamera.layers.shutter}
    onPress={onPress}
    onPressIn={() => setPressed(true)}
    onPressOut={() => setPressed(false)}
  />
}

function FlatButton ({ item, pressed: poly, onPress }: {
  item: ImagePlacement
  pressed: Polygon
  onPress: () => any
}): JSX.Element {
  const [pressed, setPressed] = useState<boolean>(false)
  return <TouchableWithoutFeedback
    onPressIn={() => setPressed(true)}
    onPressOut={() => setPressed(false)}
    onPress={onPress}
  >
    <View
      style={{
        width: poly.place.width,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? poly.fill.color : undefined
      }}
    >
      {item.img()}
    </View>
  </TouchableWithoutFeedback>
}

export interface ICameraProps {
  onPicture: (capture: ImageFile) => void
  onClose: () => void
}

export const Camera = ({ onPicture, onClose }: ICameraProps): JSX.Element => {
  const { vw, vh } = useVUnits()
  const [direction, setDirection] = useState(NativeCamera.Constants.Type.back)
  const [flashMode, setFlashMode] = useState<boolean>(NativeCamera.Constants.FlashMode.off)
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
      const capture = await ref.current.takePictureAsync({
        quality: 0.4,
        exif: true
      })
      const blob = await importFile(capture.uri)
      setEncrypting(false)
      onPicture(new ImageFile({
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

  const inset = useSafeArea()

  return <View style={containerStyle}>
    <CameraContainer style={{ width: vw(100), height: vh(100) }} zoom={zoom} type={direction} ref={ref} flashMode={flashMode} />
    <View style={{ position: 'absolute', left: inset.left, top: inset.top, width: vw(100) - inset.left - inset.right, height: vh(100) - inset.top - inset.bottom }}>
      <TouchableOpacity onPress={onClose}>
        <View style={elementCamera.closeSize.place.style()}>
          <elementCamera.close.Render />
        </View>
      </TouchableOpacity>
      <SketchImage
        src={flash}
        style={{
          position: 'absolute',
          left: vw(50) - elementCamera.flash.place.width / 2
        }}
        onPress={toggleFlash}
      />
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', width: vw(100), height: elementCamera.bg.place.height - (elementCamera.height - elementCamera.image.place.height), position: 'absolute', top: vh(100) - elementCamera.bg.place.height, backgroundColor: elementCamera.bg.fill.color }}>
      <FlatButton item={elementCamera.layers.minus} pressed={elementCamera.layers.minusBg} onPress={zoomOut} />
      <FlatButton item={elementCamera.layers.plus} pressed={elementCamera.layers.plusBg} onPress={zoomIn} />
      <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ShutterButton onPress={takePic} />
      </View>
      <FlatButton item={elementCamera.layers.flip} pressed={elementCamera.layers.flipBg} onPress={flip} />
    </View>
    {
      isEncrypting
        ? <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: elementCamera.layers.encryptingBg.fill, zIndex: 1 }}>
          <SketchElement src={elementCamera.layers.encryptingText} />
        </View>
        : <></>
    }
  </View>
}
*/
