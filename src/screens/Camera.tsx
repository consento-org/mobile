import React, { useState, useRef, useEffect } from 'react'
import { CameraContainer } from './components/CameraContainer'
import { useVUnits } from '../util/useVUnits'
import { elementCamera } from '../styles/component/elementCamera'
import { ViewStyle, View } from 'react-native'
import { Camera as NativeCamera } from 'expo-camera'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Polygon, ImagePlacement } from '../styles/Component'
import { Asset } from '../Asset'
import { IImage } from '../model/Vault'
import { importFile } from '../util/expoSecureBlobStore'
import { useSafeArea } from 'react-native-safe-area-context'

const containerStyle: ViewStyle = {
  backgroundColor: elementCamera.backgroundColor,
  width: '100%',
  height: '100%',
  position: 'absolute',
  display: 'flex'
}

const ShutterButton = ({ onPress }: { onPress: () => any }): JSX.Element => {
  const [pressed, setPressed] = useState<boolean>(false)

  return <TouchableWithoutFeedback
    onPressIn={() => setPressed(true)}
    onPressOut={() => setPressed(false)}
    onPress={onPress}
    style={{
      ...elementCamera.shutterActive.place.size()
    }}
  >
    {(pressed ? elementCamera.shutterActive : elementCamera.shutter).img()}
  </TouchableWithoutFeedback>
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
  onPicture (capture: IImage): void
}

export const Camera = ({ onPicture }: ICameraProps): JSX.Element => {
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
      onPicture({
        secretKey: blob.secretKey,
        width: capture.width,
        height: capture.height,
        exif: capture.exif
      })
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

  const flash = flashMode === NativeCamera.Constants.FlashMode.on
    ? Asset.iconCameraFlashAuto()
    : flashMode === NativeCamera.Constants.FlashMode.torch
      ? Asset.iconCameraFlashOn()
      : Asset.iconCameraFlashOff()

  const inset = useSafeArea()

  return <View style={containerStyle}>
    <CameraContainer style={{ width: vw(100), height: vh(100) }} zoom={zoom} type={direction} ref={ref} flashMode={flashMode} />
    <flash.component
      style={{
        position: 'absolute',
        top: inset.top,
        left: vw(50) - elementCamera.flash.place.width / 2
      }}
      onPress={toggleFlash}
    />
    <View style={{ display: 'flex', flexDirection: 'row', width: vw(100), height: elementCamera.bg.place.height - (elementCamera.height - elementCamera.image.place.height), position: 'absolute', top: vh(100) - elementCamera.bg.place.height, backgroundColor: elementCamera.bg.fill.color }}>
      <FlatButton item={elementCamera.minus} pressed={elementCamera.minusBg} onPress={zoomOut} />
      <FlatButton item={elementCamera.plus} pressed={elementCamera.plusBg} onPress={zoomIn} />
      <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ShutterButton onPress={takePic} />
      </View>
      <FlatButton item={elementCamera.flip} pressed={elementCamera.flipBg} onPress={flip} />
    </View>
    {
      isEncrypting
        ? <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: elementCamera.encryptingBg.fill.color, zIndex: 1 }}>
          <elementCamera.encryptingText.Render horz='center' vert='center' />
        </View>
        : <></>
    }
  </View>
}
