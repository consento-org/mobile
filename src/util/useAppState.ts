import { createGlobalEffect } from '../styles/Component'
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
  init: handler => {
    AppState.addEventListener('change', handler)
    return () => {
      AppState.removeEventListener('change', handler)
    }
  }
})
