import React, { Context } from 'react'
import { IAPI } from '@consento/api'

export const ConsentoContext: Context<IAPI> = React.createContext({
  crypto: null,
  notifications: null
})
