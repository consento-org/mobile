export enum Action {
  CHANGE_USER = 'CHANGE_USER',
  SET_SERVER = 'SET_SERVER',
  SET_MESSAGE = 'SET_MESSAGE',
  SUBMIT = 'SUBMIT',
  MESSAGE = 'MESSAGE',
  ACTIVE = 'ACTIVE'
}

export interface IChangeUser {
  type: Action.CHANGE_USER
  user: string
}

export interface ISetServer {
  type: Action.SET_SERVER
  server: string
}

export interface ISetMessage {
  type: Action.SET_MESSAGE
  message: string
}

export interface IMessage {
  type: Action.MESSAGE
  message: string
}

export interface ISubmit {
  type: Action.SUBMIT
  target: string
  message: string
}

export interface IActive {
  type: Action.ACTIVE
  active: boolean
}

export interface IAction {
  type: string
}

export function isAction <Type extends IAction> (type: Action): ((action: IAction) => action is Type) {
  return (action: IAction): action is Type => action.type === type
}

export const isSetServer = isAction<ISetServer>(Action.SET_SERVER)
export const isSetMessage = isAction<ISetMessage>(Action.SET_MESSAGE)
export const isChangeUser = isAction<IChangeUser>(Action.CHANGE_USER)
export const isSubmit = isAction<ISubmit>(Action.SUBMIT)
export const isMessage = isAction<IMessage>(Action.MESSAGE)
export const isActive = isAction<IActive>(Action.ACTIVE)
  
export const changeUser = (user: string): IChangeUser => ({
  type: Action.CHANGE_USER,
  user
})

export const setServer = (server: string): ISetServer => ({
  type: Action.SET_SERVER,
  server
})

export const setMessage = (message: string): ISetMessage => ({
  type: Action.SET_MESSAGE,
  message
})

export const message = (message: string): IMessage => ({
  type: Action.MESSAGE,
  message
})

export const submit = (target: string, message: string): ISubmit => ({
  type: Action.SUBMIT,
  message,
  target
})

export const setActive = (active: boolean): IActive => ({
  type: Action.ACTIVE,
  active
})
