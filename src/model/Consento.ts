import { IRelation } from './Relation'
import { IVault } from './Vault'

export enum TConsentoState {
  idle = 'idle',
  accepted = 'accepted',
  denied = 'denied',
  expired = 'expired'
}

export enum TConsentoType {
  requestAccess = 'requestAccess',
  requestLockee = 'requestLockee'
}

export interface IConsento {
  state: TConsentoState
  key: string
  type: TConsentoType
  time: number
}

export interface IConsentoAccess extends IConsento {
  relation: IRelation
  vault: IVault
}

export interface IConsentoLockee extends IConsento {
  relation: IRelation
  vault: IVault
}

export function isConsentoAccess (consento: IConsento): consento is IConsentoAccess {
  return consento.type === TConsentoType.requestAccess
}

export function isConsentoLockee (consento: IConsento): consento is IConsentoLockee {
  return consento.type === TConsentoType.requestLockee
}
