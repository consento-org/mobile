import React, { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { ConsentoContext } from './model/ConsentoContext'
import { setup, IAPI } from '@consento/api'
import { sodium } from '@consento/crypto/core/sodium'
import { ExpoTransport } from '@consento/notification-server'
import { getExpoToken } from './util/getExpoToken'
import { setupUsers } from './model/index'
import { Screens } from './screens/Screens'
import { ArraySet } from 'mobx-keystone'
import { User } from './model/User'
import { useConfig } from './util/useConfig'
import { Loading } from './screens/Loading'
import isURL from 'is-url-superb'

export function ConsentoApp (): JSX.Element {
  const [api, setAPI] = useState<IAPI>()
  const [config] = useConfig()
  const [users] = useState<ArraySet<User>>(setupUsers)

  if (config === null) {
    return <Loading />
  }

  const { address } = config

  useEffect(() => {
    let address = config.address
    if (!isURL(address)) {
      address = 'https://expo.consento.org'
    }
    if (/^\/\//.test(address)) {
      address = `http://${address}`
    }
    const transport = new ExpoTransport({
      address,
      getToken: getExpoToken
    })
    transport.on('error', (error) => {
      console.log({ transportError: error })
    })
    let cancel
    const stateChange = (state: AppStateStatus): void => {
      if (state !== 'background') {
        if (cancel === undefined) {
          cancel = transport.connect()
        }
      } else {
        if (cancel !== undefined) {
          cancel()
          cancel = undefined
        }
      }
    }
    AppState.addEventListener('change', stateChange)
    stateChange(AppState.currentState)
    const api = setup({
      cryptoCore: sodium,
      notificationTransport: transport
    })
    api.notifications.reset([]).catch(error => {
      console.log(`Error resetting the notifications ${error}`)
    })
    setAPI(api)
    return () => {
      AppState.removeEventListener('change', stateChange)
      stateChange('inactive')
    }
  }, [address])
  const ctx = { user: users.items[0], api }
  return <ConsentoContext.Provider value={ctx}>
    <Screens />
  </ConsentoContext.Provider>
}

export default ConsentoApp
