import { IHandshakeAcceptMessage, IAPI, ISuccessNotification } from '@consento/api'
import { Receiver } from './Connection'
import { BaseModel, findParent } from 'mobx-keystone'

export interface IRelationEntry {
  readonly relationId: string
  readonly humanId: string
  readonly name: string | null
  readonly avatarId: string | null
}

export interface ILogEntry {
  readonly key: string
  readonly time: number
  readonly text: string
}

export interface ISubscription {
  receiver: Receiver
  action: (notification: ISuccessNotification, api: IAPI) => void
}

export interface ISubscriptionMap {
  [ receiveKeyBase64: string ]: ISubscription
}

export const CONSENTO = 'consento'

function isConsento (input: any): boolean {
  return input.$modelType === CONSENTO
}

export function hasAPI (item: BaseModel<any, any>): boolean {
  const api = findParent<IConsentoModel>(item, isConsento)?.api
  return api !== undefined
}

// TODO: requireAPI is possibly a horrible hack that should be removed...
export function requireAPI (item: BaseModel<any, any>): IAPI {
  const api = findParent<IConsentoModel>(item, isConsento)?.api
  if (api === undefined) {
    throw new Error('API required, but not in API context')
  }
  return api
}

export interface IConsentoModel extends BaseModel<any, any> {
  api: IAPI
}

export enum MessageType {
  lockeeRequest = 'lockeeRequest',
  confirmLockee = 'confirmLockee',
  cancelLockee = 'cancelLockee',
  finalizeLockee = 'finalizeLockee',
  requestUnlock = 'requestUnlock',
  denyLockee = 'denyLockee',
  unlock = 'unlock',
  revokeLockee = 'revokeLockee'
}

export interface IMessage {
  version: number
}

export type Message = IRequestLockeeMessage | IConfirmLockeeMessage | IDenyLockeeMessage | IUnlockMessage | IFinalizeLockeeMessage | IRequestUnlockMessage | IRevokeLockeeMessage

export interface IRequestUnlockMessage extends IMessage {
  type: MessageType.requestUnlock
  time: number
  keepAlive: number
}

export interface IUnlockMessage extends IMessage {
  type: MessageType.unlock
  shareHex: string
}

export interface IDenyLockeeMessage extends IMessage {
  type: MessageType.denyLockee
  lockId: string
}

export interface IRequestLockeeMessage extends IMessage {
  type: MessageType.lockeeRequest
  lockId: string
  firstMessageBase64: string
  shareHex: string
  vaultName: string
}

export interface IConfirmLockeeMessage extends IMessage {
  type: MessageType.confirmLockee
  lockId: string
  acceptMessage: IHandshakeAcceptMessage
}

export interface ICancelLockeeMessage extends IMessage {
  type: MessageType.cancelLockee
  id: string
}

export interface IRevokeLockeeMessage extends IMessage {
  type: MessageType.revokeLockee
  lockId: string
}

export interface IFinalizeLockeeMessage extends IMessage {
  type: MessageType.finalizeLockee
  finalMessageBase64: string
}
