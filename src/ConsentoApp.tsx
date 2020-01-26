import React, { useEffect, useState, useContext } from 'react'
import { Screens } from './screens/Screens'
import { Consento, ConsentoContext } from './model/Consento'
import { registerRootStore, unregisterRootStore } from 'mobx-keystone'
import { Loading } from './screens/Loading'
import { ContextMenu } from './screens/components/ContextMenu'
import { autorun } from 'mobx'
import { useScreenshot, ScreenshotContext } from './util/Screenshot'

export const ConsentoApp = (): JSX.Element => {
  const [consento, setConsento] = useState<Consento>(() => new Consento({}))
  const [ready, setReady] = useState<boolean>(false)
  const screenshotRef = useContext(ScreenshotContext)?.ref
  const screenshot = useScreenshot('loading')

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

  if (!ready || !screenshot.ok) {
    screenshot.take()
    return <Loading ref={screenshotRef} />
  }

  return <ContextMenu>
    <ConsentoContext.Provider value={consento}>
      <Screens ref={screenshotRef} />
    </ConsentoContext.Provider>
  </ContextMenu>
}

export default ConsentoApp
