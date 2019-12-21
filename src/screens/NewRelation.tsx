import React, { useState, useEffect, useContext } from 'react'
import { View, Text, ViewStyle, TouchableOpacity, Alert } from 'react-native'
import { Camera } from 'expo-camera'
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types'
import { screen09ScanQRCode } from '../styles/component/screen09ScanQRCode'
import { usePermission, Permissions } from '../util/usePermission'
import { useVUnits } from '../util/useVUnits'
import { topPadding } from '../styles'
import { withNavigation, TNavigation } from './navigation'
import { useHandshake, isInitLink } from '../model/useHandshake'
import { ConsentoButton } from './components/ConsentoButton'
import QRCode from 'react-native-qrcode-svg'
import Svg, { Path } from 'react-native-svg'

interface ISize {
  width: number
  height: number
  size: string
  ratio: string
  space: number
}

let biggestSize: Promise<ISize>

function getBiggestSize (camera: Camera) {
  if (biggestSize === undefined) {
    biggestSize = (async () => {
      const ratios = await camera.getSupportedRatiosAsync()
      const sizeLists = (await Promise.all(ratios.map(ratio => camera
        .getAvailablePictureSizesAsync(ratio)
          .then(sizes => ({ ratio, sizes }))
          .catch(_ => null)
      ))).reduce((sizeLists, entry) => {
        if (entry === null) {
          return sizeLists
        }
        const {ratio, sizes} = entry
        for (const size of sizes) {
          const [_, wStr, hStr] = /(\d+)x(\d+)/.exec(size)
          const width = parseInt(wStr, 10)
          const height = parseInt(hStr, 10)
          const space = width * height
          sizeLists.push({ size, ratio, width, height, space })
        }
        return sizeLists
      }, [] as ISize[])
      return sizeLists.sort((a, b) => {
        if (a.space > b.space) return -1
        if (a.space < b.space) return 1
        return 0
      })[0]
    })()
  }
  return biggestSize
    .catch(err => {
      biggestSize = undefined
      return Promise.reject(err)
    })
}

interface Size {
  width: number
  height: number
}

function calculateCameraSize (space: Size, cameraSize: Size): ViewStyle {
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

function updateCamera (camera: Camera, setSize: (size: ISize) => any) {
  getBiggestSize(camera)
    .then(setSize)
    .catch(_ => setTimeout(updateCamera, 100, camera, setSize)) // Sometimes the camera is not immediately running, retrying again in 100ms is not a bad plan
}

const barContainer = {
  position: 'absolute',
  height: '50%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignContent: 'stretch'
} as ViewStyle

const cutOutContainer = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center'
} as ViewStyle

const retryButtonStyle = {
  position: 'absolute',
  width: '100%',
  top: topPadding,
  height: 50,
  display: 'flex',
  alignContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center'
} as ViewStyle

export const NewRelation = withNavigation(({ navigation }: { navigation: TNavigation }) => {
  const { status, reask } = usePermission(Permissions.CAMERA, error => {
    console.log(`Error while fetching permissions: ${error}`)
  })
  const { vw, vh, isHorz, isVert } = useVUnits()
  const [ size, setSize ] = useState<ISize>(undefined)
  const { initLink, connect, connectionState } = useHandshake(async connection => {
    // await addRelation(connection)
    navigation.navigate('relation', { relation: await connection.receiver.idBase64 })
  })
  const [ receivedLink, setReceivedLink ] = useState<string>(null)

  const qrSpace = isHorz ? Math.min(vw(50), vh(100)) : Math.min(vw(100), vh(50))

  const qrStyle = {
    width: isHorz ? qrSpace : vw(100),
    height: isVert ? qrSpace : vh(100),
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isHorz ? 'flex-end' : 'center'
  } as ViewStyle

  const camSpace: Size = {
    height: isHorz ? vh(100) : vh(100) - qrSpace,
    width: isHorz ? vw(100) - qrSpace : vw(100)
  }

  const cutOutSize: number = Math.min(camSpace.width, camSpace.height - topPadding - 50) - (screen09ScanQRCode.topLeft.place.left * 2)
  const cutOutRect = {
    width: cutOutSize,
    height: cutOutSize,
    left: (camSpace.width - cutOutSize) / 2,
    top: camSpace.height - screen09ScanQRCode.topLeft.place.left - cutOutSize
  }
  const cutOut = {
    position: 'absolute',
    ...cutOutRect
  } as ViewStyle

  let cameraStyle = {
    position: 'absolute'
  } as ViewStyle

  const camStyle = {
    flexGrow: 1,
    position: 'relative',
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'stretch',
    ...camSpace
  } as ViewStyle
  
  if (size !== undefined) {
    if (isHorz) {
      cameraStyle = {
        ... cameraStyle,
        ... calculateCameraSize(camSpace, size)
      }
    } else {
      cameraStyle = {
        ... cameraStyle,
        ... calculateCameraSize(camSpace, {
          height: size.width,
          width: size.height
        })
      }
    }
  }

  const cutOutG = `M0 0 L0 ${camSpace.height} L${camSpace.width} ${camSpace.height} L${camSpace.width} 0 z M${cutOut.left} ${cutOut.top} L${cutOut.left} ${cutOutRect.top + cutOutRect.height} L${cutOutRect.left + cutOutRect.width} ${cutOutRect.top + cutOutRect.height} L${cutOutRect.left + cutOutRect.width} ${cutOut.top} z`

  function onCode (code: BarCodeScanningResult) {
    if (isInitLink(code.data)) {
      if (receivedLink !== code.data) {
        setReceivedLink(code.data)
        connect(code.data)
      }
    }
  }

  return <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: isHorz ? 'row' : 'column', backgroundColor: screen09ScanQRCode.backgroundColor }}>
    <Text style={{ position: 'absolute', borderRadius: 20, top: topPadding, padding: 10, backgroundColor: '#fff', color: '#000' }}>{ connectionState }</Text>
    <View style={ camStyle }>
      <View style={{ position: 'absolute', ...camSpace, overflow: 'hidden' }}>
        { status === 'granted'
          ? <View>
              <Camera ref={camera => updateCamera(camera, setSize) } ratio={ size !== undefined ? size.ratio : undefined } style={ cameraStyle } onBarCodeScanned={ onCode } />
              <Svg viewBox={ `0 0 ${camSpace.width} ${camSpace.height}`} style={{ ...camSpace, position: 'absolute' }}>
                <Path fill={ screen09ScanQRCode.shadow.fill.color } d={ cutOutG } fillRule={ 'evenodd' } />
              </Svg>
              <View style={ cutOutContainer }>
                <View style={ cutOut }>
                  <View style={{ ...barContainer, alignItems: 'flex-start' }}>
                    {screen09ScanQRCode.topLeft.img()}
                    {screen09ScanQRCode.topRight.img()}
                  </View>
                  <View style={{ ...barContainer, top: '50%', alignItems: 'flex-end' }}>
                    {screen09ScanQRCode.bottomLeft.img()}
                    {screen09ScanQRCode.bottomRight.img()}
                  </View>
                </View>
              </View>
            </View>
          : <View style={{ paddingTop: topPadding + 50, display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
              <Text style={{ ...screen09ScanQRCode.permission.style, marginBottom: screen09ScanQRCode.retry.place.top - screen09ScanQRCode.permission.place.bottom }}>{ screen09ScanQRCode.permission.text }</Text>
              <ConsentoButton light={ true } title={ screen09ScanQRCode.retry.text.label } style={ screen09ScanQRCode.retry.place.size() } onPress={ () => reask() }/>
            </View>
        }
      </View>
      <TouchableOpacity
        style={ retryButtonStyle }
        onPress={ () => navigation.goBack() }>
        { screen09ScanQRCode.close.img() }
      </TouchableOpacity>
    </View>
    <View style={ qrStyle }>
      <View style={{ margin: screen09ScanQRCode.code.place.left }}>
      { initLink !== undefined
        ? <QRCode value={ initLink } logo={ screen09ScanQRCode.logo.asset().source } backgroundColor="#00000000" color={ screen09ScanQRCode.code.border.fill.color } size={ qrSpace - (screen09ScanQRCode.code.place.left * 2) } />
        : null
      }
      </View>
    </View>
  </View>
})
