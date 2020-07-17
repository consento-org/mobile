import React, { useEffect, useState, useContext } from 'react'
import { Screens } from './screens/Screens'
import { Consento, ConsentoContext } from './model/Consento'
import { Loading } from './screens/Loading'
import { ContextMenu } from './screens/components/ContextMenu'
import { ScreenshotContext } from './util/screenshots'
import { autoRegisterRootStore } from './util/autoRegisterRootStore'
import 'mobx-react-lite/batchingForReactNative'
import { observer } from 'mobx-react'

export const ConsentoApp = observer((): JSX.Element => {
  const [consento, setConsento] = useState<Consento>(() => new Consento({}))
  const screenshot = useContext(ScreenshotContext).loading.use()

  useEffect(
    () => {
      // Restarting app in development mode if Consento class changes.
      if (!(consento instanceof Consento)) {
        setConsento(new Consento({}))
      }
    },
    [consento, Consento]
  )

  useEffect(
    () => autoRegisterRootStore(consento),
    [consento]
  )

  if (!consento.ready || !screenshot.done) {
    screenshot.take(100)
    return <Loading />
  }

  return <ContextMenu>
    <ConsentoContext.Provider value={consento}>
      <Screens />
    </ConsentoContext.Provider>
  </ContextMenu>
})

export default ConsentoApp
