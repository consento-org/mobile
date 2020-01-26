import React from 'react'
import { useSafeArea } from 'react-native-safe-area-context'
import { View, Platform } from 'react-native'
import { Color } from '../../styles/Color'

export const DarkBar = (): JSX.Element => {
  const insets = useSafeArea()
  return <View style={{ width: '100%', height: insets.top, backgroundColor: Platform.OS === 'ios' ? Color.lightGrey : Color.veryDarkGrey }} />
}
