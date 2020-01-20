import { IDisposer } from './safeAutorun'

export function combinedDispose (...disposers: IDisposer[]): IDisposer {
  return () => {
    for (const disposer of disposers.filter(Boolean)) {
      disposer()
    }
  }
}
