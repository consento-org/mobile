import React, { useContext } from 'react'
import { View, ViewStyle, ScrollView } from 'react-native'
import { observer } from 'mobx-react'
import { EmptyView } from './components/EmptyView'
import { TopNavigation } from './components/TopNavigation'
import { elementConsentosEmpty } from '../styles/component/elementConsentosEmpty'
import { Consentos, ConsentoBecomeLockee, ConsentoUnlockVault } from '../model/Consentos'
import { elementConsentosBase } from '../styles/component/elementConsentosBase'
import { elementConsentosAccessAccepted } from '../styles/component/elementConsentosAccessAccepted'
import { screen02Consentos } from '../styles/component/screen02Consentos'
import { ConsentoState } from './components/ConsentoState'
import Svg, { Circle, Rect, G } from 'react-native-svg'
import { elementConsentosLockeeIdle } from '../styles/component/elementConsentosLockeeIdle'
import { map } from '../util/map'
import { ConsentoContext } from '../model/Consento'

const cardMargin = screen02Consentos.b.place.top - screen02Consentos.a.place.bottom

const accessCardStyle: ViewStyle = {
  position: 'relative',
  width: elementConsentosBase.width,
  height: elementConsentosBase.height,
  backgroundColor: elementConsentosBase.background.fill.color,
  margin: cardMargin,
  ...elementConsentosBase.background.borderStyle()
}

function humanTime (time: number): string {
  // TODO!
  return String(time)
}

const viewBox = `0 0 ${elementConsentosLockeeIdle.width} ${elementConsentosLockeeIdle.height}`
const lockeeCardStyle: ViewStyle = {
  position: 'relative',
  width: elementConsentosLockeeIdle.width,
  height: elementConsentosLockeeIdle.height,
  margin: cardMargin
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {}

const Consento = observer(({ consento }: { consento: Consentos }) => {
  if (consento instanceof ConsentoUnlockVault) {
    return <View style={accessCardStyle}>
      <elementConsentosBase.lastAccess.Render value={humanTime(consento.time)} />
      <elementConsentosBase.relationName.Render value='Some Person' style={{ ...elementConsentosBase.relationName.place.size(), backgroundColor: '#00000000', position: 'relative' }} />
      <elementConsentosBase.actionRequested.Render />
      <elementConsentosBase.vaultIcon.Render />
      <elementConsentosBase.vaultName.Render value='Vault Name' />
      <ConsentoState state={consento.state} onAccept={noop} onDelete={noop} style={elementConsentosAccessAccepted.state.place.style()} />
    </View>
  }
  if (consento instanceof ConsentoBecomeLockee) {
    const { card, outline } = elementConsentosLockeeIdle
    const thickness = card.border.thickness
    return <View style={lockeeCardStyle}>
      <Svg width={elementConsentosLockeeIdle.width} height={elementConsentosLockeeIdle.height} viewBox={viewBox}>
        <G fill={card.border.fill.color}>
          <Rect
            x={card.place.x}
            y={card.place.y}
            width={card.place.width}
            height={card.place.height}
            rx={card.border.radius}
            ry={card.border.radius}
          />
          <Circle
            x={outline.place.centerX}
            y={outline.place.centerY}
            r={outline.place.width / 2}
          />
        </G>
        <G fill={card.fill.color}>
          <Rect
            x={card.place.x + thickness}
            y={card.place.y + thickness}
            width={card.place.width - thickness * 2}
            height={card.place.height - thickness * 2}
            rx={card.border.radius - thickness}
            ry={card.border.radius - thickness}
          />
          <Circle
            x={outline.place.centerX}
            y={outline.place.centerY}
            r={outline.place.width / 2 - thickness}
          />
        </G>
      </Svg>
      <elementConsentosLockeeIdle.vaultIcon.Render />
      <elementConsentosLockeeIdle.lastAccess.Render />
      <elementConsentosLockeeIdle.relationName.Render />
      <elementConsentosLockeeIdle.question.Render />
      <elementConsentosLockeeIdle.vaultName.Render />
      <ConsentoState state={consento.state} onAccept={noop} onDelete={noop} style={elementConsentosLockeeIdle.state.place.style()} />
    </View>
  }
  return null
})

const listStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 20
}

export const ConsentosScreen = observer(() => {
  const { user: { consentos } } = useContext(ConsentoContext)
  return <View style={{ flex: 1 }}>
    <TopNavigation title='Consentos' />
    {
      (consentos.size === 0)
        ? <EmptyView prototype={elementConsentosEmpty} />
        : <ScrollView centerContent>
          <View style={listStyle}>
            {
              map(consentos.values(), consento => <Consento consento={consento} key={consento.$modelId} />)
            }
          </View>
        </ScrollView>
    }
  </View>
})
