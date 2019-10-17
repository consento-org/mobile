import { IAction, isChangeUser, isSetMessage, isSetServer, isActive, isMessage } from '../actions'

export interface IState {
  user?: string
  server?: string
  message: string
  active: boolean
  messages: string[]
}

const initialState = {
  message: 'Hello World',
  user: 'alice',
  active: false,
  messages: []
}

export function reduce (state: IState = initialState, action: IAction): IState {
  if (isChangeUser(action)) {
    return {
      ...state,
      user: action.user
    }
  }
  if (isSetMessage(action)) {
    return {
      ...state,
      message: action.message
    }
  }
  if (isSetServer(action)) {
    return {
      ...state,
      server: action.server
    }
  }
  if (isActive(action)) {
    return {
      ...state,
      active: action.active
    }
  }
  if (isMessage(action)) {
    return {
      ...state,
      messages: [
        ...state.messages,
        action.message
      ]
    }
  }
  return state
}
