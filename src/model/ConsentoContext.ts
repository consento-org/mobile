import React, { Context } from 'react'
import { IAPI } from '@consento/api'
import { User } from './User'

export const ConsentoContext: Context<{
  api: IAPI
  user: User
}> = React.createContext({
  api: {
    crypto: null,
    notifications: null
  },
  user: null
})
