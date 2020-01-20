import { prop, model, ObjectMap, Model, objectMap, JsonPatch, SnapshotOutOf, modelAction } from 'mobx-keystone'
import { VaultData } from './VaultData'
import { combinedDispose } from '../util/combinedDispose'
import { autorun, observable, IObservableValue, computed } from 'mobx'
import { expoVaultSecrets } from '../util/expoVaultSecrets'
import { mobxPersist } from '../util/mobxPersist'
import { Buffer } from '@consento/crypto/util/buffer'

function persist (item: VaultData, secretKeyBase64: string): () => void {
  return mobxPersist({
    item,
    secretKey: Buffer.from(secretKeyBase64, 'base64'),
    filter: (patch: JsonPatch) => {
      return patch.path !== '/dataKeyHex'
    },
    clearClone: (cloned: any) => {
      delete cloned.files.$modelId
      delete cloned.dataKeyHex
      return cloned
    },
    prepareSnapshot: (_: VaultData, snapshot: SnapshotOutOf<VaultData>) => {
      snapshot.dataKeyHex = item.dataKeyHex
      return snapshot
    }
  })
}

@model('consento/VaultStore')
export class VaultStore extends Model({
  vaults: prop<ObjectMap<VaultData>>(() => objectMap())
}) {
  _disposersByKeyHex: { [key: string]: () => void } = {}
  _loading: IObservableValue<boolean>

  onInit (): void {
    this._loading = observable.box<boolean>(true)
  }

  @computed get loading (): boolean {
    return this._loading.get()
  }

  @modelAction clear (): void {
    this.vaults.clear()
    const disposers = Object.values(this._disposersByKeyHex)
    this._disposersByKeyHex = {}
    for (const disposer of disposers) {
      disposer()
    }
  }

  onAttachedToRootStore (): () => any {
    this._loading.set(true)
    return combinedDispose(
      () => this.clear(),
      autorun(() => {
        const toDelete = new Set(this.vaults.keys())
        for (const dataKeyHex of expoVaultSecrets.secretsBase64.keys()) {
          if (!this.vaults.has(dataKeyHex)) {
            const data = new VaultData({ dataKeyHex })
            this._disposersByKeyHex[dataKeyHex] = persist(data, expoVaultSecrets.secretsBase64.get(dataKeyHex))
            this.vaults.set(dataKeyHex, data)
          } else {
            toDelete.delete(dataKeyHex)
          }
        }
        for (const dataKeyHex of toDelete) {
          this.vaults.delete(dataKeyHex)
          const disposer = this._disposersByKeyHex[dataKeyHex]
          delete this._disposersByKeyHex[dataKeyHex]
          disposer()
        }
        this._loading.set(false)
      })
    )
  }
}

export const vaultStore = new VaultStore({})
