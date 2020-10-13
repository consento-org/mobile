import { autorun, IEqualsComparer } from 'mobx'
import { useEffect, useState } from 'react'

export function useAutorun <T> (fn: () => T, comparer?: IEqualsComparer<T>): T {
  let [state, setState] = useState<T>(fn())
  useEffect(() => {
    return autorun(() => {
      const value = fn()
      if (comparer !== undefined ? !comparer(state, value) : state !== value) {
        state = value
        setState(value)
      }
    })
  }, [])
  return state
}
