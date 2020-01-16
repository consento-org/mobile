import { model, Model, tProp, types, JsonPatch, SnapshotOutOf, modelAction, prop, arraySet, objectMap } from 'mobx-keystone'
import { mobxPersist } from '../util/mobxPersist'
import { computed } from 'mobx'
import { toBuffer } from '@consento/crypto/util/buffer'
import { find } from '../util/find'

export interface IFile {
  readonly secretKeyBase64: string
  readonly secretKey: Uint8Array
  readonly type: FileType
}

export type File = ImageFile | TextFile

export enum FileType {
  image = 'image',
  text = 'text'
}

export const isImageFile = (file: File): file is ImageFile => file.type === FileType.image
export const isTextFile = (file: File): file is TextFile => file.type === FileType.text

@model('consento/VaultData/Image')
export class ImageFile extends Model({
  name: tProp(types.string, () => 'Untitled'),
  secretKeyBase64: tProp(types.string),
  width: tProp(types.number),
  height: tProp(types.number),
  exif: prop(() => objectMap())
}) implements IFile {
  get type (): FileType {
    return FileType.image
  }

  @computed get secretKey (): Uint8Array {
    return toBuffer(this.secretKeyBase64)
  }
}

@model('consento/VaultData/Text')
export class TextFile extends Model({
  name: tProp(types.string, () => 'Untitled'),
  secretKeyBase64: tProp(types.string)
}) implements IFile {
  get type (): FileType {
    return FileType.text
  }

  @computed get secretKey (): Uint8Array {
    return toBuffer(this.secretKeyBase64)
  }
}

@model('consento/VaultData')
export class VaultData extends Model({
  secretKeyBase64: tProp(types.string),
  dataKeyHex: tProp(types.string),
  loaded: tProp(types.boolean, () => false),
  files: prop(() => arraySet<File>())
}) {
  findFile (modelId: string): File {
    return find(this.files, (file: File): file is File => file.$modelId === modelId)
  }

  @computed get secretKey (): Uint8Array {
    return toBuffer(this.secretKeyBase64)
  }

  onAttachedToRootStore (): () => any {
    // TODO: Should we delete actually deleted blobs?
    let isStopped = false
    let stopPersist: () => any
    setTimeout(() => {
      stopPersist = mobxPersist({
        item: this,
        secretKey: this.secretKey,
        filter: (patch: JsonPatch) => {
          return patch.path !== '/secretKeyBase64'
        },
        clearClone: (cloned: any) => {
          delete cloned.files.$modelId
          return cloned
        },
        prepareSnapshot: (_: VaultData, snapshot: SnapshotOutOf<VaultData>) => {
          snapshot.files.$modelId = this.files.$modelId
          return snapshot
        }
      })
      if (isStopped) {
        stopPersist()
      }
    }, 0)
    return () => {
      isStopped = true
      if (stopPersist !== undefined) {
        stopPersist()
      }
    }
  }

  @modelAction _markLoaded (): void {
    if (this.loaded === false) {
      this.loaded = true
    }
  }
}
