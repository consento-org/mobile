import React, { useContext, useLayoutEffect } from 'react'
import { ScrollView, View, ViewStyle } from 'react-native'
import { observer } from 'mobx-react'
import { createEmptyView } from './components/EmptyView'
import { TopNavigation } from './components/TopNavigation'
import { IAnyConsento, ConsentoBecomeLockee, ConsentoUnlockVault } from '../model/Consentos'
import { elementConsentosEmpty } from '../styles/design/layer/elementConsentosEmpty'
import { ConsentoContext } from '../model/Consento'
import { filter } from '../util/filter'
import { isScreenshotEnabled, screenshots } from '../util/screenshots'
import { TRequestState } from '../model/RequestBase'
import { ConsentoBecomeLockeeView } from './components/ConsentoBecomeLockeeView'
import { ConsentoUnlockVaultView } from './components/ConsentoUnlockVaultView'
import { assertExists } from '../util/assertExists'

const Consento = ({ consento }: { consento: IAnyConsento }): JSX.Element => {
  if (consento instanceof ConsentoUnlockVault) {
    return <ConsentoUnlockVaultView consento={consento} />
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

const EmptyView = createEmptyView(elementConsentosEmpty)

export const ConsentosScreen = observer((): JSX.Element => {
  const consento = useContext(ConsentoContext)
  assertExists(consento)
  const { user } = consento
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
    <EmptyView isEmpty={visibleConsentos.length === 0}>
      <ScrollView contentContainerStyle={listStyle}>
        {
          visibleConsentos.map(consento => <Consento consento={consento} key={consento.$modelId} />)
        }
      </ScrollView>
    </EmptyView>
  </View>
})
