import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { elementVaultsLoading } from '../../styles/design/layer/elementVaultsLoading'
import { SketchElement } from '../../styles/util/react/SketchElement'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const animation = require('../../../assets/animation/consento_symbol_animation.gif')

const { placeholder, loadingData } = elementVaultsLoading.layers

const styles = StyleSheet.create({
  container: {
    backgroundColor: elementVaultsLoading.backgroundColor,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  animation: {
    width: placeholder.place.width,
    height: placeholder.place.height
  }
})

export const Loading = (): JSX.Element => {
  return <View style={styles.container}>
    <Image source={animation} style={styles.animation} />
    <SketchElement src={loadingData} />
  </View>
}
