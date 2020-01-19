import { autorun } from 'mobx'

export function safeAutorun (op: () => any): () => void {
  let destructor: () => any
  const destruct = autorun(() => {
    if (typeof destructor === 'function') {
      destructor()
    }
    destructor = op()
  })
  return () => {
    if (typeof destructor === 'function') {
      destructor()
      destructor = undefined
    }
    destruct()
  }
}
