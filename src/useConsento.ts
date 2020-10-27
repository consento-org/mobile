import { useEffect, useState } from 'react'
import { Consento } from './model/Consento'
import { when } from 'mobx'
import { combinedDispose } from './util/combinedDispose'
import { autoRegisterRootStore } from './util/autoRegisterRootStore'

function newConsento (): Consento {
  return new Consento({})
}

export const useConsento = (): { ready: boolean, consento: Consento, error: Error | null } => {
  const [consento, setConsento] = useState<Consento>(newConsento)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(
    () => {
      // Restarting app in development mode if Consento class changes.
      if (!(consento instanceof Consento)) {
        setConsento(newConsento())
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
        when(
          () => consento.ready,
          () => setReady(consento.ready),
          { onError: setError }
        )
      )
    },
    [consento]
  )

  return { ready, consento, error }
}

export default useConsento
