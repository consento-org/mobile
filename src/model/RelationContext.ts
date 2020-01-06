import React, { Context } from 'react'
import { Relation } from './Relation'

export const RelationContext: Context<{
  relation: Relation
}> = React.createContext({
  relation: null
})
