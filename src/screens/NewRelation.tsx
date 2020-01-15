import React, { useState, useContext } from 'react'
import { View, Text, ViewStyle, TouchableOpacity } from 'react-native'
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types'
import { screen09ScanQRCode } from '../styles/component/screen09ScanQRCode'
import { useVUnits } from '../styles/Component'
import { withNavigation, TNavigation } from './navigation'
import { useHandshake, isInitLink, IncomingState } from '../model/useHandshake'
import { CameraContainer } from './components/CameraContainer'
import { exists } from '../util/exists'
import QRCode from 'react-native-qrcode-svg'
import Svg, { Path } from 'react-native-svg'
import { ConsentoContext } from '../model/ConsentoContext'
import { fromConnection } from '../model/Relation'
import { useSafeArea } from 'react-native-safe-area-context'

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

export const NewRelation = withNavigation(({ navigation }: { navigation: TNavigation }) => {
  const { user } = useContext(ConsentoContext)
  const { vw, vh, isHorz, isVert } = useVUnits()
  const inset = useSafeArea()
  // eslint-disable-next-line @typescript-eslint/require-await
  const { incoming, outgoing, connect } = useHandshake(async (connection): Promise<void> => {
    try {
      const relation = fromConnection(connection)
      user.relations.add(relation)
      navigation.navigate('relation', { relation: relation.$modelId })
    } catch (error) {
      console.log({ error })
    }
  })
  const [receivedLink, setReceivedLink] = useState<string>(null)

  const qrSpace = isHorz ? Math.min(vw(50), vh(100)) : Math.min(vw(100), vh(50))

  const qrStyle: ViewStyle = {
    width: isHorz ? qrSpace : vw(100),
    height: isVert ? qrSpace : vh(100),
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isHorz ? 'flex-end' : 'center'
  }

  const camSpace = {
    height: isHorz ? vh(100) : vh(100) - qrSpace,
    width: isHorz ? vw(100) - qrSpace : vw(100)
  }

  const cutOutSize: number = Math.min(camSpace.width, camSpace.height - inset.top - 50) - (screen09ScanQRCode.topLeft.place.left * 2)
  const cutOutRect = {
    width: cutOutSize,
    height: cutOutSize,
    left: (camSpace.width - cutOutSize) / 2,
    top: camSpace.height - screen09ScanQRCode.topLeft.place.left - cutOutSize
  }
  const cutOut: ViewStyle = {
    position: 'absolute',
    ...cutOutRect
  }

  const cutOutG = `M0 0 L0 ${camSpace.height} L${camSpace.width} ${camSpace.height} L${camSpace.width} 0 z M${cutOut.left} ${cutOut.top} L${cutOut.left} ${cutOutRect.top + cutOutRect.height} L${cutOutRect.left + cutOutRect.width} ${cutOutRect.top + cutOutRect.height} L${cutOutRect.left + cutOutRect.width} ${cutOut.top} z`

  function onCode (code: BarCodeScanningResult): void {
    if (isInitLink(code.data)) {
      if (receivedLink !== code.data) {
        setReceivedLink(code.data)
        connect(code.data)
      }
    }
  }

  return <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: isHorz ? 'row' : 'column', backgroundColor: screen09ScanQRCode.backgroundColor }}>
    <Text style={{ position: 'absolute', borderRadius: 20, top: inset.top, padding: 10, backgroundColor: '#fff', color: '#000', zIndex: 10 }}>{String(exists(outgoing) ? outgoing.state : '')}</Text>
    <CameraContainer style={camSpace} onCode={onCode}>
      <Svg viewBox={`0 0 ${camSpace.width} ${camSpace.height}`} style={{ ...camSpace, position: 'absolute' }}>
        <Path fill={screen09ScanQRCode.shadow.fill.color} d={cutOutG} fillRule='evenodd' />
      </Svg>
      <View style={cutOutContainer}>
        <View style={cutOut}>
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
      <TouchableOpacity
        style={{ ...retryButtonStyle, top: inset.top }}
        onPress={() => navigation.goBack()}>
        {screen09ScanQRCode.close.img()}
      </TouchableOpacity>
    </CameraContainer>
    <View style={qrStyle}>
      <View style={{ margin: screen09ScanQRCode.code.place.left }}>
        {
          !exists(incoming) || incoming.state === IncomingState.init
            ? <Text>init</Text>
            : <QRCode value={incoming.ops as string} logo={screen09ScanQRCode.logo.asset().source} backgroundColor='#00000000' color={screen09ScanQRCode.code.border.fill.color} size={qrSpace - (screen09ScanQRCode.code.place.left * 2)} />
        }
        {
          exists(incoming) && incoming.state === IncomingState.confirming
            ? <Text>confirming</Text>
            : null
        }
      </View>
    </View>
  </View>
})
