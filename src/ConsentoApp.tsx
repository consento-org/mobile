import React, { useEffect, useState } from 'react'
import Constants from 'expo-constants'
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

export function ConsentoApp (): JSX.Element {
  const [api, setAPI] = useState<IAPI>()
  const [users] = useState<ArraySet<User>>(setupUsers)
  useEffect(() => {
    const address = Constants.isDevice ? 'http://192.168.11.11:3000' : 'http://10.0.2.2:3000'
    const transport = new ExpoTransport({
      address,
      getToken: getExpoToken
    })
    console.log({ address })
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
  }, [])
  const ctx = { user: users.items[0], api }
  return <ConsentoContext.Provider value={ctx}>
    <Screens />
  </ConsentoContext.Provider>
}

export default ConsentoApp
