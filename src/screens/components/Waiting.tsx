import React, { useState } from 'react'
import { View, ViewStyle, Text, TextStyle } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { createBoxOutline } from './createBoxOutline'
import useInterval from '@use-it/interval'
import { elementVaultUnlock } from '../../styles/component/elementVaultUnlock'

export interface IWaitingProps {
  start?: number
  onDone?: () => any 
}

export type TLineMode = 'center' | 'inside' | 'outside'

function adjustPath (size: number, mode: TLineMode, thickness: number) {
  if (mode === 'center') {
    return size
  }
  if (mode === 'outside') {
    return size + thickness
  }
  return size - thickness
}

function adjustBox (size: number, mode: TLineMode, thickness: number) {
  if (mode === 'center') {
    return size + thickness
  }
  if (mode === 'outside') {
    return size + thickness * 2
  }
  return size
}

const thickness = elementVaultUnlock.active.border.thickness
const width = elementVaultUnlock.active.place.width
const height = elementVaultUnlock.active.place.height
const radius = elementVaultUnlock.inactive.borderRadius
const mode: TLineMode = 'inside'
const box = createBoxOutline(adjustPath(width, mode, thickness), adjustPath(height, mode, thickness), radius)

const outWidth = adjustBox(width, mode, thickness)
const outHeight = adjustBox(height, mode, thickness)
const adjust = - thickness / 2
const viewBox = `${adjust} ${adjust} ${outWidth} ${outHeight}`
const textStyle = { ...elementVaultUnlock.waiting.style, position: 'absolute', width: outWidth, height: outHeight, fontStyle: 'italic' } as TextStyle
const absolute = { position: 'absolute' } as ViewStyle

console.log(textStyle)

export function Waiting () {
  const [ offset, setOffset ] = useState(0.2)
  useInterval(() => {
    setOffset( (offset + 0.01) % 1 )
  }, 25)

  return <View style={{ position: 'absolute', left: 0, top: 0, paddingLeft: 50, paddingTop: 50, zIndex: 10, width: 500, height: 500, backgroundColor: elementVaultUnlock.backgroundColor }}>
    <View>
      <Svg width={ outWidth } height={ outHeight } viewBox={ viewBox } style={ absolute }>
        <Path
          d={ box(0, offset) }
          fill={ 'none' }
          stroke={ elementVaultUnlock.inactive.border.fill.color }
          strokeWidth={ elementVaultUnlock.inactive.border.thickness }
          />
      </Svg>
      <Svg width={ outWidth } height={ outHeight } viewBox={ viewBox } style={ absolute }>
        <Path
          d={ box(offset, 1) }
          fill={ 'none' }
          stroke={ elementVaultUnlock.active.border.fill.color }
          strokeWidth={ thickness }
          strokeLinecap={ 'round' }
        />
      </Svg>
      <Text style={ textStyle }>{ elementVaultUnlock.waiting.text }</Text>
    </View>
  </View>
}
