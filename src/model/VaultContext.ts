import React, { Context } from 'react'
import { Vault } from './Vault'

export const VaultContext: Context<{
  vault: Vault
}> = React.createContext({
  vault: null
})
