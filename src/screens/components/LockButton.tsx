import React from 'react'
import { StyleSheet, View } from 'react-native'
import { elementSealVaultActive } from '../../styles/design/layer/elementSealVaultActive'
import { elementSealVaultIdle } from '../../styles/design/layer/elementSealVaultIdle'
import { ViewBorders } from '../../styles/util/types'
import { ConsentoButton } from './ConsentoButton'

const { borderBottom } = elementSealVaultActive.layers

const styles = StyleSheet.create({
  container: {
    height: elementSealVaultActive.place.height,
    backgroundColor: elementSealVaultActive.backgroundColor,
    ...borderBottom.borderStyle(ViewBorders.bottom),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export const LockButton = (props: { onPress?: () => any }): JSX.Element => {
  return <View style={styles.container}>
    <ConsentoButton
      src={elementSealVaultActive.layers.enabled}
      srcDisabled={elementSealVaultIdle.layers.disabled}
      onPress={props.onPress}
    />
  </View>
}
