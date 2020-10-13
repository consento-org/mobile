import React, { useState, forwardRef, useRef, useLayoutEffect, RefObject } from 'react'
import { ViewStyle, View, Platform, useWindowDimensions } from 'react-native'
import { Camera } from 'expo-camera'
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types'
import { usePermission, Permissions } from '../../util/usePermission'
import { ConsentoButton } from './ConsentoButton'
import { SketchTextBoxView } from '../../styles/util/react/SketchTextBox'
import { elementCamera } from '../../styles/design/layer/elementCamera'
import { exists } from '../../styles/util/lang'

export interface ISpace {
  width: number
  height: number
}

interface ICameraNativeSize extends ISpace {
  size: string
  ratio: string | null
  space: number
}

function calculateCameraSize (space: ISpace, cameraSize: ISpace): ViewStyle {
  const cameraRatio = cameraSize.width / cameraSize.height
  const spaceRatio = space.width / space.height
  if (cameraRatio < spaceRatio) {
    const height = space.width / cameraSize.width * cameraSize.height
    return {
      width: space.width,
      height,
      top: (space.height - height) / 2
    }
  }
  const width = space.height / cameraSize.height * cameraSize.width
  return {
    width,
    height: space.height,
    left: (space.width - width) / 2
  }
}

async function getBestSize (camera: Camera, algo: (sizeLists: ICameraNativeSize[]) => ICameraNativeSize): Promise<ICameraNativeSize> {
  let sizeLists: Array<{ ratio: string | null, sizes: string[] }>
  if (Platform.OS === 'android') {
    const ratios = await camera.getSupportedRatiosAsync()
    sizeLists = await Promise.all(ratios.map(async ratio => await camera
      .getAvailablePictureSizesAsync(ratio)
      .then(sizes => ({ ratio, sizes }))
    ))
  } else {
    sizeLists = [{
      ratio: null,
      sizes: await camera.getAvailablePictureSizesAsync()
    }]
  }
  const sizeList = sizeLists.reduce<ICameraNativeSize[]>((sizeLists, entry) => {
    if (entry === null) {
      return sizeLists
    }
    const { ratio, sizes } = entry
    for (const size of sizes) {
      const parts = /(\d+)x(\d+)/.exec(size)
      if (parts === null) {
        continue
      }
      const [wStr, hStr] = parts.slice(1)
      const width = parseInt(wStr, 10)
      const height = parseInt(hStr, 10)
      const space = width * height
      sizeLists.push({ size, ratio, width, height, space })
    }
    return sizeLists
  }, []).sort((a, b) => {
    if (a.space > b.space) return -1
    if (a.space < b.space) return 1
    return 0
  })
  return algo(sizeList)
}

let minCameraSize: Promise<ICameraNativeSize> | undefined

async function getMinCameraSize (camera: Camera, minSpace: number): Promise<ICameraNativeSize> {
  if (minCameraSize === undefined) {
    minCameraSize = getBestSize(camera, (sizeLists: ICameraNativeSize[]): ICameraNativeSize => {
      sizeLists = sizeLists.reverse()
      let biggest: ICameraNativeSize = sizeLists[0]
      for (const sizeList of sizeLists) {
        if (sizeList.space >= minSpace) {
          return sizeList
        }
        biggest = sizeList
      }
      return biggest
    })
  }
  return await minCameraSize
    .catch(async err => {
      minCameraSize = undefined
      return await Promise.reject(err)
    })
}

function updateCamera (cameraRef: RefObject<Camera>, setNativeSize: (size: ICameraNativeSize) => any): void {
  const camera = cameraRef?.current
  if (!exists(camera)) {
    return
  }
  getMinCameraSize(camera, 921600 /* 1280x720 */)
    .then(setNativeSize)
    .catch(err => {
      console.log(`Notice: trying to update the native size doesn't always work, here is this times error: ${String(err)}`)
      setTimeout(updateCamera, 100, cameraRef, setNativeSize)
    }) // Sometimes the camera is not immediately running, retrying again in 100ms is not a bad plan
}

export interface ICameraContainerProps {
  onCode?: (code: BarCodeScanningResult) => void
  style: ViewStyle & {
    width: number
    height: number
  }
  children?: React.ReactChild | React.ReactChild[]
  ref?: RefObject<Camera>
  zoom?: number
  flashMode?: any
  type?: any
  onCameraReady?: () => any
}

const containerStyle: ViewStyle = {
  position: 'relative',
  backgroundColor: '#000',
  overflow: 'hidden'
}

const uiStyle: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  overflow: 'hidden'
}

const permissionStyle: ViewStyle = {
  ...uiStyle,
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'center'
}

function assertRefObject (ref: ((instance: Camera | null) => void) | React.MutableRefObject<Camera | null> | null): asserts ref is React.MutableRefObject<Camera | null> | null {
  if (typeof ref === 'function') {
    throw new Error('Reference hooks are not supported for camera')
  }
}

export const CameraContainer = forwardRef<Camera, ICameraContainerProps>((props, ref): JSX.Element => {
  /* eslint-disable react/prop-types */
  const { onCode, style, zoom, flashMode, type, onCameraReady } = props
  let { children } = props
  const { status, reask } = usePermission(Permissions.CAMERA, error => {
    console.log(`Error while fetching permissions: ${String(error)}`) // TODO: Create a system error log
  })
  const [nativeSize, setNativeSize] = useState<ICameraNativeSize | undefined>(undefined)
  const window = useWindowDimensions()
  const isHorz = window.width > window.height
  assertRefObject(ref)
  if (!exists(ref)) {
    ref = useRef<Camera>(null)
  }

  let cameraStyle: ViewStyle = {
    position: 'absolute'
  }

  if (status === 'denied') {
    children = <View style={permissionStyle}>
      <SketchTextBoxView
        src={elementCamera.layers.permission}
        style={{
          marginBottom: elementCamera.layers.retry.place.spaceY(elementCamera.layers.permission.place)
        }}
      />
      <ConsentoButton src={elementCamera.layers.retry} style={{ left: null as unknown as number, top: null as unknown as number }} onPress={reask} />
    </View>
  } else if (nativeSize !== undefined) {
    cameraStyle = {
      ...cameraStyle,
      ...calculateCameraSize(style, isHorz ? nativeSize : {
        height: nativeSize.width,
        width: nativeSize.height
      })
    }
  }

  const myRef = ref /* Typescript will ignore previous asserts, TODO: write a bug at typescript */

  useLayoutEffect(() => {
    updateCamera(myRef, setNativeSize)
  }, [myRef, status])

  return <View style={{ ...containerStyle, ...style }}>
    {
      status === 'granted' ? <Camera
        ref={myRef}
        type={type}
        ratio={nativeSize?.ratio ?? undefined}
        style={cameraStyle}
        onBarCodeScanned={onCode}
        zoom={zoom}
        flashMode={flashMode}
        onCameraReady={onCameraReady}
      /> : null
    }
    <View style={uiStyle}>{children}</View>
  </View>
})
