import React from 'react'
import { Relation } from './Relation'

export const RelationContext = React.createContext<{ relation: Relation | null }>({
  relation: null
})
