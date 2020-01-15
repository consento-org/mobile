import React, { useState, forwardRef, useRef, useLayoutEffect, RefObject } from 'react'
import { ViewStyle, View, Platform } from 'react-native'
import { Camera } from 'expo-camera'
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types'
import { useVUnits } from '../../styles/Component'
import { usePermission, Permissions } from '../../util/usePermission'
import { elementCamera } from '../../styles/component/elementCamera'
import { ConsentoButton } from './ConsentoButton'

export interface ISpace {
  width: number
  height: number
}

interface ICameraNativeSize extends ISpace {
  size: string
  ratio: string
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
  let sizeLists: Array<{ ratio: string, sizes: string[] }>
  if (Platform.OS === 'android') {
    const ratios = await camera.getSupportedRatiosAsync()
    sizeLists = await Promise.all(ratios.map(async ratio => camera
      .getAvailablePictureSizesAsync(ratio)
      .then(sizes => ({ ratio, sizes }))
    ))
  } else {
    sizeLists = [{
      ratio: null,
      sizes: await camera.getAvailablePictureSizesAsync()
    }]
  }
  const sizeList = sizeLists.reduce((sizeLists, entry) => {
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
  }, [] as ICameraNativeSize[]).sort((a, b) => {
    if (a.space > b.space) return -1
    if (a.space < b.space) return 1
    return 0
  })
  return algo(sizeList)
}

/*
let biggestSize: Promise<ICameraNativeSize>
async function getBiggestSize (camera: Camera): Promise<ICameraNativeSize> {
  if (biggestSize === undefined) {
    biggestSize = getBestSize(camera, (sizeLists: ICameraNativeSize[]) => {
      return sizeLists[0]
    })
  }
  return biggestSize
    .catch(async err => {
      biggestSize = undefined
      return Promise.reject(err)
    })
}
*/

let minCameraSize: Promise<ICameraNativeSize>
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
  return minCameraSize
    .catch(async err => {
      minCameraSize = undefined
      return Promise.reject(err)
    })
}

function updateCamera (camera: RefObject<Camera>, setNativeSize: (size: ICameraNativeSize) => any): void {
  getMinCameraSize(camera.current, 921600)
    .then(setNativeSize)
    .catch(err => {
      if (camera.current === null) {
        return
      }
      console.log(`Notice: trying to update the native size doesn't always work, here is this times error: ${err}`)
      setTimeout(updateCamera, 100, camera, setNativeSize)
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

export const CameraContainer = forwardRef(({ onCode, children, style, zoom, flashMode, type, onCameraReady }: ICameraContainerProps, ref: RefObject<Camera>): JSX.Element => {
  const { status, reask } = usePermission(Permissions.CAMERA, error => {
    console.log(`Error while fetching permissions: ${error}`) // TODO: Create a system error log
  })
  const { isHorz } = useVUnits()
  const [nativeSize, setNativeSize] = useState<ICameraNativeSize>(undefined)
  if (ref === null || ref === undefined) {
    ref = useRef<Camera>()
  }

  let cameraStyle: ViewStyle = {
    position: 'absolute'
  }

  if (status === 'denied') {
    children = <View style={permissionStyle}>
      <elementCamera.permission.Render
        style={{
          marginBottom: elementCamera.retry.place.top - elementCamera.permission.place.bottom
        }}
      />
      <ConsentoButton proto={elementCamera.retry} style={{ left: null, top: null }} onPress={reask} />
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

  useLayoutEffect(() => {
    if (ref.current !== undefined) {
      updateCamera(ref, setNativeSize)
    }
  }, [ref, status])

  return <View style={{ ...containerStyle, ...style }}>
    {
      status === 'granted'
        ? <Camera
          ref={ref}
          type={type}
          ratio={nativeSize?.ratio}
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
