import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { elementCredits } from '../../styles/design/layer/elementCredits'
import { SketchElement } from '../../styles/util/react/SketchElement'

const { iconNgiLedger, iconEu, funding } = elementCredits.layers

const styles = StyleSheet.create({
  /* eslint-disable @typescript-eslint/consistent-type-assertions */
  container: {
    position: 'relative',
    alignSelf: 'center',
    width: elementCredits.place.width,
    flexDirection: 'column'
  } as ViewStyle,
  icons: {
    display: 'flex',
    alignContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },
  ngiLedger: {
    marginTop: iconNgiLedger.place.top,
    alignSelf: 'flex-start'
  },
  eu: {
    alignSelf: 'flex-end'
  },
  funding: {
    marginTop: Math.min(
      funding.place.spaceY(iconNgiLedger.place),
      funding.place.spaceY(iconEu.place)
    ),
    paddingBottom: funding.place.bottom
  }
})

export function Credits ({ style }: { style: ViewStyle }): JSX.Element {
  return <View style={StyleSheet.compose<ViewStyle>(styles.container, style)}>
    <View style={styles.icons}>
      <SketchElement src={iconNgiLedger} style={styles.ngiLedger} />
      <SketchElement src={iconEu} style={styles.eu} />
    </View>
    <SketchElement src={funding} style={styles.funding} />
  </View>
}
