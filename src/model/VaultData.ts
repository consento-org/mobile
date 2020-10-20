import { model, Model, tProp, types, modelAction, prop, objectMap, getParent, arraySet } from 'mobx-keystone'
import { computed } from 'mobx'
import { toBuffer, bufferToString, Buffer } from '@consento/api/util'
import { find } from '../util/find'
import { readBlob, writeBlob, safeFileName } from '../util/expoSecureBlobStore'
import { IHandshakeInitJSON, IHandshakeAcceptMessage, ISenderJSON, IConnectionJSON, IAPI } from '@consento/api'
import { Sender } from './Connection'
import { humanModelId } from '../util/humanModelId'
import { ILogEntry } from './Consento.types'

export interface IFile {
  readonly secretKeyBase64: string
  readonly secretKey: Uint8Array
  readonly type: FileType
  readonly fileName: string
  readonly name: string
}

export type File = ImageFile | TextFile

export enum FileType {
  image = 'image',
  text = 'text'
}

export const isImageFile = (file: File | null | undefined): file is ImageFile => file?.type === FileType.image
export const isTextFile = (file: File | null | undefined): file is TextFile => file?.type === FileType.text

@model('consento/VaultData/Image')
export class ImageFile extends Model({
  name: tProp(types.string),
  secretKeyBase64: tProp(types.string),
  width: tProp(types.number),
  height: tProp(types.number),
  size: tProp(types.number, () => -1),
  exif: prop<Record<string, any>>(() => objectMap())
}) implements IFile {
  get type (): FileType {
    return FileType.image
  }

  @computed get secretKey (): Uint8Array {
    return toBuffer(this.secretKeyBase64)
  }

  get fileName (): string {
    return `${safeFileName(this.name)}.jpg`
  }
}

@model('consento/VaultData/Text')
export class TextFile extends Model({
  name: tProp(types.string),
  secretKeyBase64: tProp(types.string),
  size: tProp(types.number, () => -1)
}) implements IFile {
  get type (): FileType {
    return FileType.text
  }

  get log (): ILogEntry[] {
    return []
  }

  async saveText (text: string): Promise<void> {
    const { secretKey, size } = await writeBlob(text)
    this._saveText(bufferToString(secretKey, 'base64'), size)
  }

  @modelAction _saveText (secretKeyBase64: string, size?: number): void {
    this.secretKeyBase64 = secretKeyBase64
    this.size = size ?? -1
  }

  async loadText (): Promise<string> {
    if (this.secretKeyBase64 === null || this.secretKeyBase64 === '') {
      return ''
    }
    try {
      const fromFs = await readBlob(Buffer.from(this.secretKeyBase64, 'base64'))
      return fromFs as string
    } catch (_) {
      return ''
    }
  }

  @computed get secretKey (): Uint8Array {
    return toBuffer(this.secretKeyBase64)
  }

  get fileName (): string {
    return `${safeFileName(this.name)}.txt`
  }
}

export interface IVaultLockeeConfirmation {
  connectionJSON: IConnectionJSON
  shareHex: string
  finalMessage: Uint8Array
}

@model('consento/VaultData/log/addLockee')
export class AddLockeeEntry extends Model({
  time: tProp(types.number, () => Date.now()),
  relationId: tProp(types.string),
  vaultLockeeId: tProp(types.string)
}) implements ILogEntry {
  get key (): string {
    return this.$modelId
  }

  get text (): string {
    return 'You added a new lockee.'
  }
}

@model('consento/VaultData/log/revokeLockee')
export class RevokeLockeeEntry extends Model({
  time: tProp(types.number, () => Date.now()),
  relationId: tProp(types.string),
  reason: prop<TVaultRevokeReason>(),
  vaultLockeeId: tProp(types.string)
}) implements ILogEntry {
  get key (): string {
    return this.$modelId
  }

  get text (): string {
    return 'You removed a lockee.'
  }
}

@model('consento/VaultData/Lockee')
export class VaultLockee extends Model({
  relationId: tProp(types.string),
  lockId: tProp(types.string),
  sender: prop<Sender | null>(() => null),
  shareHex: tProp(types.maybeNull(types.string), () => null),
  initJSON: prop<IHandshakeInitJSON | null>(() => null)
}) {
  _lock: boolean | undefined

  get isConfirmed (): boolean {
    return this.sender !== null
  }

  get initPending (): boolean {
    return this.initJSON !== null
  }

  @computed get humanId (): string {
    return humanModelId(this.relationId)
  }

  async confirm (acceptMessage: IHandshakeAcceptMessage, api: IAPI): Promise<IVaultLockeeConfirmation | undefined> {
    if (!this.initPending) {
      return
    }
    if (this._lock ?? false) {
      throw new Error('Operation locked! Can not confirm lockee')
    }
    this._lock = true
    const { crypto } = api
    const { initJSON } = this
    if (initJSON === null) {
      throw new Error('Lockee has already been confirmed. (no initJSON)')
    }
    const init = new crypto.HandshakeInit(initJSON)
    const { finalMessage, connection } = await init.confirm(acceptMessage)
    const shareHex = this._confirm(connection.sender.toJSON())
    return {
      connectionJSON: connection.toJSON(),
      finalMessage,
      shareHex
    }
  }

  @modelAction _confirm (senderJSON: ISenderJSON): string {
    this.sender = new Sender(senderJSON)
    const { shareHex } = this
    if (shareHex === null) {
      throw new Error('Lockee has already been confirmed. (no shareHex)')
    }
    this.shareHex = null
    this.initJSON = null
    return shareHex
  }
}

export enum TVaultRevokeReason {
  denied = 'denied',
  error = 'error',
  revoked = 'revoked'
}

@model('consento/VaultData')
export class VaultData extends Model({
  dataKeyHex: tProp(types.string),
  loaded: tProp(types.boolean, () => false),
  files: prop((): File[] => []),
  lockees: prop(() => arraySet<VaultLockee>()),
  log: prop((): ILogEntry[] => [])
}) {
  findFile (modelId: string): File | undefined {
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

  @modelAction revokeLockee (lockee: VaultLockee, reason: TVaultRevokeReason): boolean {
    if (!this.lockees.has(lockee)) {
      return false
    }
    this.lockees.delete(lockee)
    this.log.push(new RevokeLockeeEntry({
      vaultLockeeId: lockee.$modelId,
      relationId: lockee.relationId,
      reason
    }))
    return true
  }

  @modelAction addLockee (lockee: VaultLockee): boolean {
    if (this.lockees.has(lockee)) {
      return false
    }
    this.lockees.add(lockee)
    this.log.push(new AddLockeeEntry({
      vaultLockeeId: lockee.$modelId,
      relationId: lockee.relationId
    }))
    return true
  }

  isUnusedFilename (filename: string): boolean {
    return this.findFileByName(filename) === undefined
  }

  @modelAction setFilename (file: File, filename: string): void {
    const parent = getParent(file)
    if (parent !== this.files) {
      throw new Error(`Can not set file name for [${file.name}]: File not part of this vault.`)
    }
    const existingFile = this.findFileByName(filename)
    if (existingFile === undefined) {
      file.name = filename
      return
    }
    if (existingFile !== file) {
      throw new Error(`Can not set new file name for [${file.name}]: File with this filename [${filename}] already exists.`)
    }
  }

  newFilename (): string {
    let index = 0
    let filename: string
    do {
      index += 1
      filename = `Untitled-${index.toString()}`
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

  @modelAction _markLoaded (): void {
    if (!this.loaded) {
      this.loaded = true
    }
  }
}
