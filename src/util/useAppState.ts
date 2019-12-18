import { createGlobalEffect } from './createGlobalEffect'
import { AppState } from 'react-native'

export const useAppState = createGlobalEffect({
  update () {
    const state = AppState.currentState
    return {
      state,
      isBackground: state === 'background',
      isInactive: state === 'inactive',
      isActive: state === 'active'
    }
  },
  init: handler => AppState.addEventListener('change', handler),
  exit: handler => AppState.removeEventListener('change', handler)
})
