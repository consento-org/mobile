import React from 'react'
import { View, ViewStyle } from 'react-native'
import { screen01Welcome } from '../styles/component/screen01Welcome'

const style: ViewStyle = {
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  flex: 1,
  backgroundColor: screen01Welcome.backgroundColor
}

export function Loading () {
  return <View style={style}>
    { screen01Welcome.illustration.asset().img() }
  </View>
}
