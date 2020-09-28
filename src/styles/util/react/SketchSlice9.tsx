// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import React from 'react'
import { View, ViewStyle, Image, ImageStyle, ViewProps, StyleSheet } from 'react-native'
import { ISlice9, ISketchElementProps } from '../types'
import { Placement } from '../Placement'

export interface ISketchSlice9Props extends
  ISketchElementProps<ISlice9>,
  ViewProps {
  ref?: React.Ref<View>
}

const rowsStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row'
}

interface ISlicePartStyles {
  box: ViewStyle
  row_0: ViewStyle
  row_1: ViewStyle
  row_2: ViewStyle
  cell_0: ImageStyle
  cell_1: ImageStyle
  cell_2: ImageStyle
  cell_3: ImageStyle
  cell_4: ImageStyle
  cell_5: ImageStyle
  cell_6: ImageStyle
  cell_7: ImageStyle
  cell_8: ImageStyle
}

const styleCache = new WeakMap<Placement, { [key: string]: ISlicePartStyles }>()
function getStyles (place: Placement, width: number, height: number): ISlicePartStyles {
  let byPlace = styleCache.get(place)
  if (byPlace === undefined) {
    byPlace = {}
    styleCache.set(place, byPlace)
  }
  const key = `${width}x${height}`
  let result = byPlace[key]
  if (result === undefined) {
    result = StyleSheet.create({
      box: {
        display: 'flex',
        flexDirection: 'column',
        width: place.width,
        height: place.height
      },
      row_0: {
        ...rowsStyle,
        height: place.y
      },
      row_1: {
        ...rowsStyle,
        flexGrow: 1,
        flexShrink: 0,
        marginTop: -0.05 // Fixing accidental appearing empty lines
      },
      row_2: {
        ...rowsStyle,
        height: place.bottom
      },
      // 'stretch' Causes images to flicker on first render
      // It looks weird if only the streched images flicker.
      cell_0: { resizeMode: 'stretch', width: place.left, height: place.top },
      cell_1: { resizeMode: 'stretch', flexShrink: 1, flexGrow: 1, height: place.top },
      cell_2: { resizeMode: 'stretch', width: place.right, height: place.top },
      cell_3: { resizeMode: 'stretch', width: place.left, height: '100%' },
      cell_4: { resizeMode: 'stretch', flexShrink: 1, flexGrow: 1, height: '100%' },
      cell_5: { resizeMode: 'stretch', width: place.right, height: '100%' },
      cell_6: { resizeMode: 'stretch', width: place.left, height: place.bottom },
      cell_7: { resizeMode: 'stretch', flexShrink: 1, flexGrow: 1, height: place.bottom },
      cell_8: { resizeMode: 'stretch', width: place.right, height: place.bottom }
    })
    byPlace[key] = result
  }
  return result
}

export const SketchSlice9 = (props: ISketchSlice9Props): JSX.Element => {
  const { src } = props
  const styles = getStyles(src.slice, src.place.width, src.place.height)
  const slices = src.slices()
  if (slices.length !== 9) {
    throw new Error('For a slice-9 we need 9 resources!')
  }
  return React.createElement(
    View,
    {
      ...props,
      style: StyleSheet.compose(styles.box, props.style)
    },
    <>
      <View style={styles.row_0}>
        <Image source={slices[0]} style={styles.cell_0} fadeDuration={0} />
        <Image source={slices[1]} style={styles.cell_1} fadeDuration={0} />
        <Image source={slices[2]} style={styles.cell_2} fadeDuration={0} />
      </View>
      <View style={styles.row_1}>
        <Image source={slices[3]} style={styles.cell_3} fadeDuration={0} />
        <Image source={slices[4]} style={styles.cell_4} fadeDuration={0} />
        <Image source={slices[5]} style={styles.cell_5} fadeDuration={0} />
      </View>
      <View style={styles.row_2}>
        <Image source={slices[6]} style={styles.cell_6} fadeDuration={0} />
        <Image source={slices[7]} style={styles.cell_7} fadeDuration={0} />
        <Image source={slices[8]} style={styles.cell_8} fadeDuration={0} />
      </View>
    </>
  )
}
