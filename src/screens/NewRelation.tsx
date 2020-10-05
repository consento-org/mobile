import React, { useState, useContext } from 'react'
import { View, ViewStyle, TouchableOpacity, useWindowDimensions } from 'react-native'
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types'
import { useHandshake, isInitLink, OutgoingState, IncomingState } from '../model/useHandshake'
import { CameraContainer } from './components/CameraContainer'
import { exists } from '@consento/api/util'
import QRCode from 'react-native-qrcode-svg'
import Svg, { Path } from 'react-native-svg'
import { fromConnection } from '../model/Relation'
import { ConsentoContext } from '../model/Consento'
import { goBack, navigate } from '../util/navigate'
import { screen09ScanQRCode } from '../styles/design/layer/screen09ScanQRCode'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SketchElement } from '../styles/util/react/SketchElement'
import { assertExists } from '../util/assertExists'

const barContainer: ViewStyle = {
  position: 'absolute',
  height: '50%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignContent: 'stretch'
}

const cutOutContainer: ViewStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center'
}

const retryButtonStyle: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: 50,
  display: 'flex',
  alignContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center'
}

export const NewRelation = (): JSX.Element => {
  const consento = useContext(ConsentoContext)
  assertExists(consento)
  const { user } = consento
  const inset = useSafeAreaInsets()
  const window = useWindowDimensions()
  // eslint-disable-next-line @typescript-eslint/require-await
  const { incoming, outgoing, connect } = useHandshake(async (connection): Promise<void> => {
    try {
      const relation = fromConnection(connection)
      user.relations.add(relation)
      navigate('relation', { relation: relation.$modelId })
    } catch (error) {
      console.error(error)
    }
  })
  const [receivedLink, setReceivedLink] = useState<string | null>(null)

  const isHorz = window.width > window.height
  const isVert = !isHorz

  const qrSpace = isHorz ? Math.min(window.width / 2, window.height) : Math.min(window.width, window.height / 2)

  const qrStyle: ViewStyle = {
    width: isHorz ? qrSpace : window.width,
    height: isVert ? qrSpace : window.height,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isHorz ? 'flex-end' : 'center'
  }

  const camSpace = {
    height: window.height - (isHorz ? 0 : qrSpace),
    width: window.width - (isHorz ? qrSpace : 0)
  }

  const cutOutSize: number = Math.min(camSpace.width, camSpace.height - inset.top - 50) - (screen09ScanQRCode.layers.topLeft.place.left * 2)
  const cutOutRect = {
    width: cutOutSize,
    height: cutOutSize,
    left: (camSpace.width - cutOutSize) / 2,
    top: camSpace.height - screen09ScanQRCode.layers.topLeft.place.left - cutOutSize
  }
  const cutOut: ViewStyle = {
    position: 'absolute',
    ...cutOutRect
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const cutOutG = `M0 0 L0 ${camSpace.height} L${camSpace.width} ${camSpace.height} L${camSpace.width} 0 z M${cutOut.left} ${cutOut.top} L${cutOut.left} ${cutOutRect.top + cutOutRect.height} L${cutOutRect.left + cutOutRect.width} ${cutOutRect.top + cutOutRect.height} L${cutOutRect.left + cutOutRect.width} ${cutOut.top} z`

  function onCode (code: BarCodeScanningResult): void {
    if (isInitLink(code.data)) {
      if (receivedLink !== code.data) {
        setReceivedLink(code.data)
        connect(code.data)
      }
    }
  }

  const size = qrSpace - (screen09ScanQRCode.layers.code.place.left * 2)

  return <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: isHorz ? 'row' : 'column', backgroundColor: screen09ScanQRCode.backgroundColor }}>
    <CameraContainer style={camSpace} onCode={onCode}>
      <Svg viewBox={`0 0 ${camSpace.width.toString()} ${camSpace.height.toString()}`} style={{ ...camSpace, position: 'absolute' }}>
        <Path fill={screen09ScanQRCode.layers.shadow.fill.color} d={cutOutG} fillRule='evenodd' />
      </Svg>
      <View style={cutOutContainer}>
        <View style={cutOut}>
          {
            (exists(outgoing) && outgoing?.state !== OutgoingState.idle)
              ? <View style={{ ...barContainer, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{
                  width: screen09ScanQRCode.layers.outgoingBadge.place.width,
                  height: screen09ScanQRCode.layers.outgoingBadge.place.height,
                  borderRadius: screen09ScanQRCode.layers.outgoingBadge.borderStyle().borderRadius,
                  backgroundColor: screen09ScanQRCode.layers.outgoingBadge.fill.color,
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <SketchElement
                    src={screen09ScanQRCode.layers[outgoing.state === OutgoingState.confirming ? 'outgoingConfirming' : 'outgoingConnecting']}
                  />
                </View>
              </View>
              : null
          }
          <View style={{ ...barContainer, alignItems: 'flex-start' }}>
            <SketchElement src={screen09ScanQRCode.layers.topLeft} />
            <SketchElement src={screen09ScanQRCode.layers.topRight} />
          </View>
          <View style={{ ...barContainer, top: '50%', alignItems: 'flex-end' }}>
            <SketchElement src={screen09ScanQRCode.layers.bottomLeft} />
            <SketchElement src={screen09ScanQRCode.layers.bottomRight} />
          </View>
        </View>
      </View>
      <TouchableOpacity style={{ ...retryButtonStyle, top: inset.top }} onPress={goBack}>
        <SketchElement src={screen09ScanQRCode.layers.close} />
      </TouchableOpacity>
    </CameraContainer>
    <View style={qrStyle}>
      <View style={{ margin: screen09ScanQRCode.layers.code.place.left }}>
        {
          !exists(incoming) || incoming.state === IncomingState.init
            ? <SketchElement src={screen09ScanQRCode.layers.incomingLoading} />
            : <>
              {
                incoming.state === IncomingState.confirming
                  ? <View style={{ zIndex: 1, position: 'absolute', width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                      width: screen09ScanQRCode.layers.incomingBadge.place.width,
                      height: screen09ScanQRCode.layers.incomingBadge.place.height,
                      borderRadius: screen09ScanQRCode.layers.incomingBadge.borderStyle().borderRadius,
                      backgroundColor: screen09ScanQRCode.layers.incomingBadge.fill.color,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <SketchElement src={screen09ScanQRCode.layers.incomingConnecting} />
                    </View>
                  </View>
                  : null
              }
              <QRCode value={incoming.options as string} logo={screen09ScanQRCode.layers.logo.source()} backgroundColor='#00000000' color={screen09ScanQRCode.layers.code.svg?.stroke} size={size} />
            </>
        }
      </View>
    </View>
  </View>
}
