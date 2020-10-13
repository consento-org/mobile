import { DependencyList, useEffect } from 'react'
import { AbortController, AbortError, AbortSignal } from '@consento/api/util'

export function useAbortableEffect (fn: (signal: AbortSignal) => Promise<void>, deps?: DependencyList, handleError?: (error: Error) => void): void {
  useEffect(() => {
    const control = new AbortController()
    const realHandleError = handleError ?? ((error: Error): void => console.error(error.stack))
    let aborted = false
    try {
      fn(control.signal).catch((error: Error) => {
        if (aborted && error instanceof AbortError) {
          return
        }
        realHandleError(error)
      })
    } catch (err) {
      realHandleError(err)
      return
    }
    return () => {
      aborted = true
      control.abort()
    }
  }, deps)
}
