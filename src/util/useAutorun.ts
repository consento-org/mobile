import { autorun, IEqualsComparer } from 'mobx'
import { useEffect, useState } from 'react'

export function useAutorun <T> (fn: () => T, isEquals?: IEqualsComparer<T>, deps?: React.DependencyList): T {
  let [state, setState] = useState<T>(fn())
  useEffect(() => {
    return autorun(() => {
      const value = fn()
      if (isEquals !== undefined ? !isEquals(state, value) : state !== value) {
        state = value
        setState(value)
      }
    })
  }, deps ?? [])
  return state
}
