import React from 'react'
import { Vault } from './Vault'

export const VaultContext = React.createContext<{ vault: Vault | null }>({
  vault: null
})
