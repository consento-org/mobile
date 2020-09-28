import React from 'react'
import { useSafeArea } from 'react-native-safe-area-context'
import { View, Platform, StyleSheet, ViewStyle } from 'react-native'
import { Color } from '../../styles/design/Color'

const styles = StyleSheet.create({
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  darkbar: {
    width: '100%',
    backgroundColor: Platform.OS === 'ios' ? Color.lightGrey : Color.veryDarkGrey
  } as ViewStyle
})

export const DarkBar = (): JSX.Element => {
  const insets = useSafeArea()
  return <View style={StyleSheet.compose(styles.darkbar, { height: insets.top })} />
}
