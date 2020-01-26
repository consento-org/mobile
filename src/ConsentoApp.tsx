import React, { useEffect, useState, useContext } from 'react'
import { Screens } from './screens/Screens'
import { Consento, ConsentoContext } from './model/Consento'
import { registerRootStore, unregisterRootStore } from 'mobx-keystone'
import { Loading } from './screens/Loading'
import { ContextMenu } from './screens/components/ContextMenu'
import { autorun } from 'mobx'
import { ScreenshotContext } from './util/screenshots'

export const ConsentoApp = (): JSX.Element => {
  const [consento, setConsento] = useState<Consento>(() => new Consento({}))
  const [ready, setReady] = useState<boolean>(false)
  const screenshot = useContext(ScreenshotContext).loading.use()

  useEffect(
    () => {
      registerRootStore(consento)
      return () => unregisterRootStore(consento)
    },
    [Consento]
  )

  if (!(consento instanceof Consento)) {
    setReady(false)
    setConsento(new Consento({}))
  }

  useEffect(
    () => autorun(() => {
      if (ready !== consento.ready) {
        setReady(consento.ready)
      }
    }),
    [consento, ready]
  )

  if (!ready || !screenshot.done) {
    screenshot.take(100)
    return <Loading />
  }

  return <ContextMenu>
    <ConsentoContext.Provider value={consento}>
      <Screens />
    </ConsentoContext.Provider>
  </ContextMenu>
}

export default ConsentoApp
