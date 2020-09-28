// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import React from 'react'
import { View, ViewStyle, ViewProps, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { ISketchElementProps, isSketchError, IPolygon } from '../types'
import { exists } from '../lang'

export interface ISketchPolygonProps extends
  ISketchElementProps<IPolygon>,
  ViewProps {}

const styleCache = new WeakMap<IPolygon, ViewStyle>()
function getStyle (polygon: IPolygon): ViewStyle {
  let style = styleCache.get(polygon)
  if (style === undefined) {
    const data = polygon.fill.data
    style = StyleSheet.create({
      internal: {
        width: polygon.place.width,
        height: polygon.place.height,
        backgroundColor: typeof data === 'string' ? data : undefined,
        ...polygon.borderStyle()
      }
    }).internal
    styleCache.set(polygon, style)
  }
  return style
}

export const SketchPolygon = (props: ISketchPolygonProps): JSX.Element => {
  const polygon = props.src
  const data = polygon.fill.data
  const style = StyleSheet.compose(getStyle(polygon), props.style)
  if (!exists(data) || typeof data === 'string') {
    return React.createElement(View, {
      ...props,
      style
    })
  }
  if (isSketchError(data)) {
    throw new Error(data.error)
  }
  return React.createElement(LinearGradient, {
    colors: data.gradient.stops.map(stop => stop.color),
    locations: data.gradient.stops.map(stop => stop.position),
    start: [data.gradient.from.x, data.gradient.from.y],
    end: [data.gradient.to.x, data.gradient.to.y],
    ...props,
    style
  })
}
