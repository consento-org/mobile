import React from 'react'
import { View, Platform, StyleSheet, ViewStyle } from 'react-native'
import { Color } from '../../styles/design/Color'
import { StatusBar } from 'expo-status-bar'

const backgroundColor = Platform.OS === 'ios' ? Color.lightGrey : Color.veryDarkGrey

const styles = StyleSheet.create({
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  darkbar: {
    width: '100%',
    height: 20,
    backgroundColor
  } as ViewStyle
})

const byHeight = new Map<number, ViewStyle>()

export const DarkBar = ({ height }: { height: number }): JSX.Element => {
  let style = byHeight.get(height)
  if (style === undefined) {
    style = StyleSheet.create({ darkbar: { height } }).darkbar
    byHeight.set(height, style)
  }

  return <>
    <View style={StyleSheet.compose(styles.darkbar, style)} />
    {/*
      By design the following statusbar element should not be necessary but
      expo has a bug: When you open the management screen on android it keeps
      the status bar of the management screen when turning back to the app
      by setting it here specifically it should also return to our style when
      the UI is rerendered.
      */}
    <StatusBar backgroundColor={backgroundColor} translucent style='light' />
  </>
}
