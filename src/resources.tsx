import React from 'react'
import { Text } from 'react-native'
import { context } from './util/context'

export const resources = context({
  icons: {
    navigation: {
      vaults: <Text>{'V'}</Text>,
      consentos: <Text>{'C'}</Text>,
      relations: <Text>{'R'}</Text>
    }
  },
  strings: {
    navigation: {
      vaults: 'Vaults',
      consentos: 'Consentos',
      relations: 'Relations'
    }
  }
})
