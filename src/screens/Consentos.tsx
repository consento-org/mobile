import React, { useContext, useLayoutEffect } from 'react'
import { ScrollView, View, ViewStyle } from 'react-native'
import { observer } from 'mobx-react'
import { EmptyView } from './components/EmptyView'
import { TopNavigation } from './components/TopNavigation'
import { IAnyConsento, ConsentoBecomeLockee, ConsentoUnlockVault } from '../model/Consentos'
import { ConsentoState } from './components/ConsentoState'
import { elementConsentosEmpty } from '../styles/design/layer/elementConsentosEmpty'
import { elementConsentosAccessIdle } from '../styles/design/layer/elementConsentosAccessIdle'
import { ConsentoContext } from '../model/Consento'
import { useHumanSince } from '../util/useHumanSince'
import { Avatar } from './components/Avatar'
import { filter } from '../util/filter'
import { ScreenshotContext, useScreenshotEnabled } from '../util/screenshots'
import { TRequestState } from '../model/RequestBase'
import { SketchElement } from '../styles/util/react/SketchElement'
import { ConsentoBecomeLockeeView } from './components/ConsentoBecomeLockeeView'
import { screen02Consentos } from '../styles/design/layer/screen02Consentos'

const cardMargin = screen02Consentos.layers.b.place.spaceY(screen02Consentos.layers.a.place)

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
    return <ConsentoBecomeLockeeView consento={consento} />
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
  const consento = useContext(ConsentoContext)
  if (consento === null) {
    throw new Error('not in consento context')
  }
  const { user } = consento
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
      <ScrollView contentContainerStyle={listStyle}>
        {
          visibleConsentos.map(consento => <Consento consento={consento} key={consento.$modelId} />)
        }
      </ScrollView>
    </EmptyView>
  </View>
})
