import React, { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { ConsentoContext } from './model/ConsentoContext'
import { setup, IAPI } from '@consento/api'
import { ExpoTransport } from '@consento/notification-server'
import { getExpoToken } from './util/getExpoToken'
import { Screens } from './screens/Screens'
import { ArraySet, registerRootStore, ObjectMap } from 'mobx-keystone'
import { User, createDefaultUser } from './model/User'
import { useConfig } from './util/useConfig'
import { Loading } from './screens/Loading'
import { cryptoCore } from './cryptoCore'
import isURL from 'is-url-superb'
import { observer } from 'mobx-react'
import { ContextMenu } from './screens/components/ContextMenu'

export const ConsentoApp = observer((): JSX.Element => {
  const [api, setAPI] = useState<IAPI>()
  const [config] = useConfig()
  const [users] = useState<ArraySet<User>>(() => {
    const users = new ArraySet<User>({})
    users.add(createDefaultUser())
    registerRootStore(new ObjectMap({
      items: {
        users: users
      }
    }))
    return users
  })

  useEffect(() => {
    if (config === null) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}
    }
    let address = config.address
    if (!isURL(address)) {
      address = 'https://notify.consento.org'
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
    let cancel: () => void
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
      cryptoCore,
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
  }, [config])

  const user: User = users.items[0]

  if (config === null || !user.loaded) {
    return <Loading />
  }

  const ctx = { user, api, users }
  return <ContextMenu>
    <ConsentoContext.Provider value={ctx}>
      <Screens />
    </ConsentoContext.Provider>
  </ContextMenu>
})

export default ConsentoApp
