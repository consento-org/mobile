import { useState, useEffect } from 'react'

export function createGlobalEffect <T> ({ update, init, exit }: {
  update (): T | undefined
  init (handler: () => any): void
  exit (handler: () => any): void
}): () => T {
  const listeners = new Set<(lastUpdate: number) => any>()
  const output: T = update()
  let globalLastUpdate: number
  function updateOutput (): void {
    const newOutput = update()
    if (newOutput === undefined) {
      return
    }
    globalLastUpdate = Date.now()
    const iter = listeners.values()
    do {
      const update = iter.next()
      if (update.done) {
        return
      }
      update.value(globalLastUpdate)
    } while (true)
  }
  return () => {
    const setLastUpdate = useState<number>(globalLastUpdate)[1]
    useEffect(() => {
      listeners.add(setLastUpdate)
      if (listeners.size === 1) {
        init(updateOutput)
      }
      return () => {
        listeners.delete(setLastUpdate)
        if (listeners.size === 0) {
          exit(updateOutput)
        }
      }
    }, [false]) // Only update the effect once
    return output
  }
}
