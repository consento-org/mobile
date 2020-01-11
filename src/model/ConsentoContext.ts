import React, { Context } from 'react'
import { IAPI } from '@consento/api'
import { User } from './User'
import { ArraySet } from 'mobx-keystone'

export const ConsentoContext: Context<{
  api: IAPI
  user: User
  users: ArraySet<User>
}> = React.createContext({
  api: {
    crypto: null,
    notifications: null
  },
  user: null,
  users: null
})
