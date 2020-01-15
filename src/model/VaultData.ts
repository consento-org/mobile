import { model, Model, tProp, types, JsonPatch, SnapshotOutOf, modelAction } from 'mobx-keystone'
import { mobxPersist } from '../util/mobxPersist'
import { computed } from 'mobx'
import { toBuffer } from '@consento/crypto/util/buffer'

@model('consento/VaultData')
export class VaultData extends Model({
  secretKeyBase64: tProp(types.string),
  dataKeyHex: tProp(types.string),
  loaded: tProp(types.boolean, () => false)
}) {
  @computed get secretKey (): Uint8Array {
    return toBuffer(this.secretKeyBase64)
  }

  onAttachedToRootStore (): () => any {
    return mobxPersist({
      item: this,
      secretKey: this.secretKey,
      filter: (patch: JsonPatch) => {
        return patch.path !== '/secretKeyBase64'
      },
      clearClone: (cloned: any) => {
        return cloned
      },
      prepareSnapshot: (item: VaultData, snapshot: SnapshotOutOf<VaultData>) => {
        return snapshot
      }
    })
  }

  @modelAction _markLoaded (): void {
    if (this.loaded === false) {
      this.loaded = true
    }
  }
}
