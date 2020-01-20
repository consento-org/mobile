import { IHandshakeAcceptMessage, IAPI, ISuccessNotification } from '@consento/api'
import { Receiver } from './Connection'
import { BaseModel, findParent } from 'mobx-keystone'

export interface ISubscription {
  receiver: Receiver
  action: (notification: ISuccessNotification, api: IAPI) => void
}

export const CONSENTO = 'consento'

export function requireAPI (item: BaseModel<any, any>): IAPI {
  const api = findParent(item, isConsento)?.api
  if (api === undefined) {
    throw new Error('API required, but not in API context')
  }
  return api
}

export interface IConsentoModel extends BaseModel<any, any> {
  api: IAPI
}

export function isConsento (input: BaseModel<any, any>): input is IConsentoModel {
  return input.$modelType === CONSENTO
}

export enum MessageType {
  lockeeRequest = 'lockeeRequest',
  confirmLockee = 'confirmLockee',
  cancelLockee = 'cancelLockee',
  finalizeLockee = 'finalizeLockee',
  unlock = 'unlock'
}

export interface IMessage {
  version: number
}

export type Message = IRequestLockeeMessage | IConfirmLockeeMessage | IUnlockMessage

export interface IUnlockMessage extends IMessage {
  type: MessageType.unlock
  id: string
  shareHex: string
}

export interface IRequestLockeeMessage extends IMessage {
  type: MessageType.lockeeRequest
  pendingLockId: string
  firstMessageBase64: string
  shareHex: string
}

export interface IConfirmLockeeMessage extends IMessage {
  type: MessageType.confirmLockee
  pendingLockId: string
  acceptMessage: IHandshakeAcceptMessage
}

export interface ICancelLockeeMessage extends IMessage {
  type: MessageType.cancelLockee
  id: string
}

export interface IFinalizeLockeeMessage extends IMessage {
  type: MessageType.finalizeLockee
  finalMessageBase64: string
}
