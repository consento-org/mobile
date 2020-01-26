import React, { useContext, useLayoutEffect } from 'react'
import { View, ViewStyle, ScrollView } from 'react-native'
import { observer } from 'mobx-react'
import Svg, { Circle, Rect, G } from 'react-native-svg'
import { EmptyView } from './components/EmptyView'
import { TopNavigation } from './components/TopNavigation'
import { elementConsentosEmpty } from '../styles/component/elementConsentosEmpty'
import { IAnyConsento, ConsentoBecomeLockee, ConsentoUnlockVault } from '../model/Consentos'
import { screen02Consentos } from '../styles/component/screen02Consentos'
import { ConsentoState } from './components/ConsentoState'
import { elementConsentosLockeeIdle } from '../styles/component/elementConsentosLockeeIdle'
import { ConsentoContext } from '../model/Consento'
import { useHumanSince } from '../util/useHumanSince'
import { Avatar } from './components/Avatar'
import { elementConsentosAccessIdle } from '../styles/component/elementConsentosAccessIdle'
import { filter } from '../util/filter'
import { withNavigationFocus } from 'react-navigation'
import { ScreenshotContext, useScreenshotEnabled } from '../util/screenshots'
import { TRequestState } from '../model/RequestBase'

const cardMargin = screen02Consentos.b.place.top - screen02Consentos.a.place.bottom

const viewBox = `0 0 ${elementConsentosLockeeIdle.width.toString()} ${elementConsentosLockeeIdle.height.toString()}`
const lockeeCardStyle: ViewStyle = {
  position: 'relative',
  width: elementConsentosLockeeIdle.width,
  height: elementConsentosLockeeIdle.height,
  margin: cardMargin
}

const BecomeLockee = observer(({ consento }: { consento: ConsentoBecomeLockee }) => {
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
    <elementConsentosLockeeIdle.lastAccess.Render value={useHumanSince(consento.creationTime)} />
    <elementConsentosLockeeIdle.relationName.Render value={consento.relationName !== '' ? consento.relationName : null} />
    <elementConsentosLockeeIdle.relationID.Render value={consento.relationHumanId} />
    <Avatar place={elementConsentosLockeeIdle.avatar.place} avatarId={consento.relationAvatarId} />
    <elementConsentosLockeeIdle.question.Render />
    <elementConsentosLockeeIdle.vaultName.Render value={consento.vaultName} />
    <ConsentoState state={consento.state} onAccept={consento.handleAccept} onDelete={consento.handleHide} style={elementConsentosLockeeIdle.state.place.style()} />
  </View>
})

const UnlockVault = observer(({ consento }: { consento: ConsentoUnlockVault }) => {
  const { requestBase: { component: requestBase }, state } = elementConsentosAccessIdle
  const accessCardStyle: ViewStyle = {
    position: 'relative',
    width: requestBase.width,
    height: requestBase.height,
    backgroundColor: requestBase.background.fill.color,
    margin: cardMargin,
    ...requestBase.background.borderStyle()
  }
  return <View style={accessCardStyle}>
    <requestBase.lastAccess.Render value={useHumanSince(consento.time)} />
    <requestBase.relationName.Render value={consento.relationName !== '' ? consento.relationName : null} />
    <requestBase.relationID.Render value={consento.relationHumanId} />
    <requestBase.actionRequested.Render />
    <Avatar place={requestBase.avatar.place} avatarId={consento.relationAvatarId} />
    <requestBase.vaultIcon.Render />
    <requestBase.vaultName.Render value={consento.vaultName} />
    <ConsentoState state={consento.state} onAccept={consento.handleAccept} onDelete={consento.handleDelete} style={state.place.style()} expiration={consento.expiration} />
  </View>
})

const Consento = ({ consento }: { consento: IAnyConsento }): JSX.Element => {
  if (consento instanceof ConsentoUnlockVault) {
    return <UnlockVault consento={consento} />
  }
  if (consento instanceof ConsentoBecomeLockee) {
    return <BecomeLockee consento={consento} />
  }
  return null
}

const listStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 20
}

const FocusedConsentosScreen = observer((): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  const screenshots = useContext(ScreenshotContext)
  const isScreenshotEnabled = useScreenshotEnabled()
  const { consentos } = user
  const visibleConsentos = filter(
    consentos.values(),
    (consento): consento is IAnyConsento => !(consento instanceof ConsentoBecomeLockee) || !consento.isHidden
  ).reverse()
  useLayoutEffect(() => {
    user.recordConsentosView()
  }, [visibleConsentos[0]])
  if (isScreenshotEnabled) {
    if (visibleConsentos.length === 0) {
      screenshots.consentosEmpty.takeSync(500)
    } else {
      for (const consento of visibleConsentos) {
        if (consento instanceof ConsentoUnlockVault) {
          console.log(consento.state)
          if (consento.state === TRequestState.active) {
            screenshots.consentosUnlockPending.takeSync(200)
          } else if (consento.state === TRequestState.confirmed) {
            screenshots.consentosUnlockAccepted.takeSync(200)
          } else if (consento.state === TRequestState.expired) {
            screenshots.consentosUnlockExpired.takeSync(200)
          } else if (consento.state === TRequestState.denied) {
            screenshots.consentosUnlockDenied.takeSync(200)
          }
        }
        if (consento instanceof ConsentoBecomeLockee) {
          if (consento.state === TRequestState.confirmed) {
            screenshots.consentosBecomeUnlockeeAccepted.takeSync(200)
          } else if (consento.state === TRequestState.cancelled) {
            screenshots.consentosBecomeUnlockeeRevoked.takeSync(200)
          } else if (consento.state === TRequestState.accepted) {
            screenshots.consentosBecomeUnlockeeConfirming.takeSync(200)
          } else if (consento.state === TRequestState.denied) {
            screenshots.consentosBecomeUnlockeeDenied.takeSync(200)
          } else {
            screenshots.consentosBecomeUnlockeePending.takeSync(200)
          }
        }
      }
    }
  }
  return <View style={{ flex: 1 }}>
    <TopNavigation title='Consentos' />
    {
      (visibleConsentos.length === 0)
        ? <EmptyView prototype={elementConsentosEmpty} />
        : <ScrollView centerContent>
          <View style={listStyle}>
            {
              visibleConsentos.map(consento => <Consento consento={consento} key={consento.$modelId} />)
            }
          </View>
        </ScrollView>
    }
  </View>
})

export const ConsentosScreen = withNavigationFocus(({ isFocused }: { isFocused: boolean }) => {
  if (isFocused) {
    return <FocusedConsentosScreen />
  }
  return <View />
})
