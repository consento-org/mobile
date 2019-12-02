export enum TVaultState {
  open = 'open',
  locked = 'locked',
  pending = 'pending'
}

export interface IVault {
  state: TVaultState
  name: string
  key: string
}
