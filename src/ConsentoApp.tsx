import React, { useEffect, useState } from 'react'
import { Screens } from './screens/Screens'
import { Consento, ConsentoContext } from './model/Consento'
import { registerRootStore, unregisterRootStore } from 'mobx-keystone'
import { Loading } from './screens/Loading'
import { observer } from 'mobx-react'
import { ContextMenu } from './screens/components/ContextMenu'

export const ConsentoApp = observer((): JSX.Element => {
  const [consento] = useState<Consento>(() => new Consento({}))

  useEffect(() => {
    registerRootStore(consento)
    return () => unregisterRootStore(consento)
  }, [])

  if (!consento.ready) {
    return <Loading />
  }

  return <ContextMenu>
    <ConsentoContext.Provider value={consento}>
      <Screens />
    </ConsentoContext.Provider>
  </ContextMenu>
})

export default ConsentoApp
