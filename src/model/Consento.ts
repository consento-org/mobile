import { IRelation } from './Relation'
import { IVault } from './Vault'

export enum TConsentoAccessState {
  idle = 'idle',
  accepted = 'accepted',
  denied = 'denied',
  expired = 'expired'
}

export enum TConsentoType {
  requestAccess = 'requestAccess'
}

export interface IConsento {
  key: string
  type: TConsentoType
  time: number
}

export interface IConsentoAccess extends IConsento {
  state: TConsentoAccessState
  relation: IRelation
  vault: IVault
}

export function isConsentoAccess (consento: IConsento): consento is IConsentoAccess {
  return consento.type === TConsentoType.requestAccess
}
