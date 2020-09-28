import { useEffect, useState } from 'react'
import { Consento } from './model/Consento'
import { autoRegisterRootStore } from './util/autoRegisterRootStore'
import { when } from 'mobx'
import { unregisterRootStore } from 'mobx-keystone'
import { combinedDispose } from './util/combinedDispose'

export const useConsento = (): Consento => {
  const [consento, setConsento] = useState<Consento>(() => new Consento({}))
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<Error>(null)

  useEffect(
    () => {
      // Restarting app in development mode if Consento class changes.
      if (!(consento instanceof Consento)) {
        unregisterRootStore(consento)
        console.log('updating consento')
        setConsento(new Consento({}))
      }
    },
    [consento, Consento]
  )

  useEffect(
    () => {
      setError(null)
      setReady(false)
      return combinedDispose(
        autoRegisterRootStore(consento),
        when(() => consento.ready, () => setReady(true), { onError: setError })
      )
    },
    [consento]
  )
  if (error !== null) {
    throw error
  }
  if (!ready) {
    return
  }
  return consento
}

export default useConsento
