import { autorun, IAutorunOptions, IReactionPublic } from 'mobx'

export type IDisposer = () => void

export function safeAutorun (view: (r: IReactionPublic) => IDisposer, opts?: IAutorunOptions): () => void {
  let disposer: (() => any) | undefined
  const destruct = autorun((r) => {
    if (typeof disposer === 'function') {
      disposer()
    }
    disposer = view(r)
  }, opts)
  return () => {
    if (typeof disposer === 'function') {
      disposer()
      disposer = undefined
    }
    destruct()
  }
}
