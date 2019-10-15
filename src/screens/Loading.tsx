import React from 'react'
import { View, Text } from 'react-native'

export function Loading () {
  return <View style={{ justifyContent: 'center', flex: 1 }}>
    <Text style={{ textAlign: 'center' }}>{"Loading ..."}</Text>
  </View>
}
