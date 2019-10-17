import React from 'react'
import { View, Image, Text } from 'react-native'
import { Fonts } from '../fonts'

export function Loading () {
  return <View style={{ justifyContent: 'center', alignContent: 'center', flex: 1 }}>
    <Image source={ require('../../assets/images/logo.png')} />
  </View>
}
