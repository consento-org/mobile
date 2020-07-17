import { registerRootStore, unregisterRootStore } from 'mobx-keystone'

export function autoRegisterRootStore (node: object): () => void {
  registerRootStore(node)
  return () => unregisterRootStore(node)
}
