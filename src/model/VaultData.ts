import { model, Model, tProp, types, JsonPatch, SnapshotOutOf, modelAction, prop, objectMap, getParent } from 'mobx-keystone'
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
  name: tProp(types.maybeNull(types.string), () => null),
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
  name: tProp(types.maybeNull(types.string), () => null),
  secretKeyBase64: tProp(types.maybeNull(types.string), () => null)
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
  files: prop((): File[] => [])
}) {
  findFile (modelId: string): File {
    return find(this.files, (file: File): file is File => file.$modelId === modelId)
  }

  @modelAction addFile (file: File): void {
    if (file.name === null) {
      file.name = this.newFilename()
    } else {
      if (!this.isUnusedFilename(file.name)) {
        throw new Error(`Can not add file: File with this filename [${file.name}] already exists.`)
      }
    }
    this.files.push(file)
  }

  @modelAction deleteFile (file: File): void {
    const index = this.files.indexOf(file)
    if (index === -1) {
      throw new Error(`Can not remove file ${file.name}: File not added.`)
    }
    this.files.splice(index, 1)
  }

  isUnusedFilename (filename: string): boolean {
    return this.findFileByName(filename) === undefined
  }

  @modelAction setFilename (file: File, filename: string): void {
    const parent = getParent(file)
    console.log({ parent })
    const existingFile = this.findFileByName(filename)
    if (existingFile === undefined) {
      file.name = filename
    }
    if (existingFile !== file) {
      throw new Error(`Can not set new file name for [${file.name}]: File with this filename [${filename}] already exists.`)
    }
  }

  @computed get secretKey (): Uint8Array {
    return toBuffer(this.secretKeyBase64)
  }

  newFilename (): string {
    let index = 0
    let filename: string
    do {
      index += 1
      filename = `Untitled-${index}`
    } while (!this.isUnusedFilename(filename))
    return filename
  }

  @computed get filenameMap (): { [filename: string]: File } {
    const map: { [filename: string]: File } = {}
    for (const file of this.files) {
      map[file.name] = file
    }
    return map
  }

  findFileByName (filename: string): File {
    return this.filenameMap[filename]
  }

  onAttachedToRootStore (): () => any {
    // TODO: Should we delete actually deleted blobs?
    const stopPersist = mobxPersist({
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
        return snapshot
      }
    })

    return () => {
      stopPersist()
    }
  }

  @modelAction _markLoaded (): void {
    if (this.loaded === false) {
      this.loaded = true
    }
  }
}
