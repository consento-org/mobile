import React, { useContext, useLayoutEffect } from 'react'
import { View, ViewStyle } from 'react-native'
import { observer } from 'mobx-react'
import Svg, { Circle, Rect, G } from 'react-native-svg'
import { EmptyView } from './components/EmptyView'
import { TopNavigation } from './components/TopNavigation'
import { IAnyConsento, ConsentoBecomeLockee, ConsentoUnlockVault } from '../model/Consentos'
import { ConsentoState } from './components/ConsentoState'
import { screen02Consentos } from '../styles/design/layer/screen02Consentos'
import { elementConsentosEmpty } from '../styles/design/layer/elementConsentosEmpty'
import { elementConsentosLockeeIdle } from '../styles/design/layer/elementConsentosLockeeIdle'
import { elementConsentosAccessIdle } from '../styles/design/layer/elementConsentosAccessIdle'
import { ConsentoContext } from '../model/Consento'
import { useHumanSince } from '../util/useHumanSince'
import { Avatar } from './components/Avatar'
import { filter } from '../util/filter'
import { ScreenshotContext, useScreenshotEnabled } from '../util/screenshots'
import { TRequestState } from '../model/RequestBase'
import { SketchElement } from '../styles/util/react/SketchElement'
import { Color } from '../styles/design/Color'

const cardMargin = screen02Consentos.layers.b.place.spaceY(screen02Consentos.layers.a.place)

const viewBox = `0 0 ${elementConsentosLockeeIdle.place.width} ${elementConsentosLockeeIdle.place.height}`
const lockeeCardStyle: ViewStyle = {
  position: 'relative',
  width: elementConsentosLockeeIdle.place.width,
  height: elementConsentosLockeeIdle.place.height,
  margin: cardMargin
}

const BecomeLockee = observer(({ consento }: { consento: ConsentoBecomeLockee }) => {
  const { card, outline } = elementConsentosLockeeIdle.layers
  const thickness = card.svg?.strokeWidth ?? 0
  const borderRadius = card.borderStyle().borderRadius ?? 0
  return <View style={lockeeCardStyle}>
    <Svg width={elementConsentosLockeeIdle.place.width} height={elementConsentosLockeeIdle.place.height} viewBox={viewBox}>
      <G fill={card.svg?.stroke ?? Color.white}>
        <Rect
          x={card.place.x}
          y={card.place.y}
          width={card.place.width}
          height={card.place.height}
          rx={borderRadius}
          ry={borderRadius}
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
          rx={borderRadius - thickness}
          ry={borderRadius - thickness}
        />
        <Circle
          x={outline.place.centerX}
          y={outline.place.centerY}
          r={outline.place.width / 2 - thickness}
        />
      </G>
    </Svg>
    <SketchElement src={elementConsentosLockeeIdle.layers.vaultIcon} />
    <SketchElement src={elementConsentosLockeeIdle.layers.lastAccess} value={useHumanSince(consento.creationTime)} />
    <SketchElement src={elementConsentosLockeeIdle.layers.relationName} value={consento.relationName !== '' ? consento.relationName : undefined} />
    <SketchElement src={elementConsentosLockeeIdle.layers.relationID} value={consento.relationHumanId} />
    <View style={{ position: 'absolute', left: elementConsentosLockeeIdle.layers.avatar.place.left, top: elementConsentosLockeeIdle.layers.avatar.place.top }}>
      <Avatar size={elementConsentosLockeeIdle.layers.avatar.place.width} avatarId={consento.relationAvatarId} />
    </View>
    <SketchElement src={elementConsentosLockeeIdle.layers.question} />
    <SketchElement src={elementConsentosLockeeIdle.layers.vaultName} value={consento.vaultName} />
    <ConsentoState state={consento.state} onAccept={consento.handleAccept} onDelete={consento.handleHide} style={elementConsentosLockeeIdle.layers.state.place} />
  </View>
})

const UnlockVault = observer(({ consento }: { consento: ConsentoUnlockVault }) => {
  const { requestBase, state } = elementConsentosAccessIdle.layers
  const { lastAccess, relationName, relationID, actionRequested, avatar, vaultIcon, vaultName } = requestBase.layers
  const accessCardStyle: ViewStyle = {
    position: 'relative',
    width: requestBase.place.width,
    height: requestBase.place.height,
    backgroundColor: requestBase.layers.background.fill.color,
    margin: cardMargin,
    ...requestBase.layers.background.borderStyle()
  }
  return <View style={accessCardStyle}>
    <SketchElement src={lastAccess} style={{ position: 'absolute', left: lastAccess.place.left, top: lastAccess.place.top }} value={useHumanSince(consento.time)} />
    <SketchElement src={relationName} style={{ position: 'absolute', left: relationName.place.left, top: relationName.place.top }} value={consento.relationName !== '' ? consento.relationName : undefined} />
    <SketchElement src={relationID} style={{ position: 'absolute', left: relationID.place.left, top: relationID.place.top }} value={consento.relationHumanId} />
    <SketchElement src={actionRequested} style={{ position: 'absolute', left: actionRequested.place.left, top: actionRequested.place.top }} />
    <View style={{ position: 'absolute', left: avatar.place.left, top: avatar.place.top }}>
      <Avatar size={avatar.place.width} avatarId={consento.relationAvatarId} />
    </View>
    <SketchElement src={vaultIcon} style={{ position: 'absolute', left: vaultIcon.place.left, top: vaultIcon.place.top }} />
    <SketchElement src={vaultName} style={{ position: 'absolute', left: vaultIcon.place.left, top: vaultIcon.place.top }} />
    <SketchElement src={vaultName} value={consento.vaultName} />
    <ConsentoState state={consento.state} onAccept={consento.handleAccept} onDelete={consento.handleDelete} style={{ position: 'absolute', left: state.place.left, top: state.place.top }} expiration={consento.expiration} />
  </View>
})

const Consento = ({ consento }: { consento: IAnyConsento }): JSX.Element => {
  if (consento instanceof ConsentoUnlockVault) {
    return <UnlockVault consento={consento} />
  }
  if (consento instanceof ConsentoBecomeLockee) {
    return <BecomeLockee consento={consento} />
  }
  console.log('[Warning] Unknown Consento:')
  console.log({ consento })
  return <></>
}

const listStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 20
}

export const ConsentosScreen = observer((): JSX.Element => {
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
    <EmptyView empty={elementConsentosEmpty} isEmpty={visibleConsentos.length === 0}>
      <View style={listStyle}>
        {
          visibleConsentos.map(consento => <Consento consento={consento} key={consento.$modelId} />)
        }
      </View>
    </EmptyView>
  </View>
})
