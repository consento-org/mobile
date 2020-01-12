import React, { useState, forwardRef, useRef, useLayoutEffect, RefObject } from 'react'
import { ViewStyle, View } from 'react-native'
import { Camera } from 'expo-camera'
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types'
import { useVUnits } from '../../util/useVUnits'
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

let biggestSize: Promise<ICameraNativeSize>

async function getBiggestSize (camera: Camera): Promise<ICameraNativeSize> {
  if (biggestSize === undefined) {
    biggestSize = (async () => {
      const ratios = await camera.getSupportedRatiosAsync()
      const sizeLists = (await Promise.all(ratios.map(async ratio => camera
        .getAvailablePictureSizesAsync(ratio)
        .then(sizes => ({ ratio, sizes }))
        .catch(_ => null)
      ))).reduce((sizeLists, entry) => {
        if (entry === null) {
          return sizeLists
        }
        const { ratio, sizes } = entry
        for (const size of sizes) {
          const [wStr, hStr] = /(\d+)x(\d+)/.exec(size).slice(1)
          const width = parseInt(wStr, 10)
          const height = parseInt(hStr, 10)
          const space = width * height
          sizeLists.push({ size, ratio, width, height, space })
        }
        return sizeLists
      }, [] as ICameraNativeSize[])
      return sizeLists.sort((a, b) => {
        if (a.space > b.space) return -1
        if (a.space < b.space) return 1
        return 0
      })[0]
    })()
  }
  return biggestSize
    .catch(async err => {
      biggestSize = undefined
      return Promise.reject(err)
    })
}

function updateCamera (camera: Camera, setNativeSize: (size: ICameraNativeSize) => any): void {
  getBiggestSize(camera)
    .then(setNativeSize)
    .catch(err => {
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

export const CameraContainer = forwardRef(({ onCode, children, style, zoom, flashMode, type }: ICameraContainerProps, ref: RefObject<Camera>): JSX.Element => {
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
      updateCamera(ref.current, setNativeSize)
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
          useCamera2Api
        /> : null
    }
    <View style={uiStyle}>{children}</View>
  </View>
})
