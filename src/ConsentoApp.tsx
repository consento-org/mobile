import React, { useEffect, useState } from 'react'
import { Screens } from './screens/Screens'
import { Consento, ConsentoContext } from './model/Consento'
import { registerRootStore, unregisterRootStore } from 'mobx-keystone'
import { Loading } from './screens/Loading'
import { ContextMenu } from './screens/components/ContextMenu'
import { autorun } from 'mobx'

export const ConsentoApp = (): JSX.Element => {
  const [consento, setConsento] = useState<Consento>(() => new Consento({}))
  const [ready, setReady] = useState<boolean>(false)

  useEffect(
    () => {
      registerRootStore(consento)
      return () => unregisterRootStore(consento)
    },
    [Consento]
  )

  useEffect(
    () => autorun(() => setReady(consento.ready)),
    [Consento]
  )

  if (!(consento instanceof Consento)) {
    setReady(false)
    setConsento(new Consento({}))
    return <Loading />
  }

  if (!ready) {
    return <Loading />
  }

  return <ContextMenu>
    <ConsentoContext.Provider value={consento}>
      <Screens />
    </ConsentoContext.Provider>
  </ContextMenu>
}

export default ConsentoApp
