import { reaction, IReactionOptions, IReactionPublic } from 'mobx'
import { IDisposer } from './safeAutorun'

export function safeReaction<T> (
  expression: (r: IReactionPublic) => T,
  effect: (args: T, r: IReactionPublic) => IDisposer | undefined,
  opts?: IReactionOptions
): IDisposer {
  let disposer: IDisposer | undefined
  const dispose = reaction(
    expression,
    (args: T, r: IReactionPublic) => {
      if (typeof disposer === 'function') {
        disposer()
      }
      disposer = effect(args, r)
    }
    , opts
  )
  return () => {
    if (typeof disposer === 'function') {
      disposer()
      disposer = undefined
    }
    dispose()
  }
}
