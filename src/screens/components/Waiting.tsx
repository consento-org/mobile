import React, { useState } from 'react'
import Svg, { Path } from 'react-native-svg'
import { View, ViewStyle, Text, TextStyle } from 'react-native'
import { createBoxOutline } from './createBoxOutline'
import { elementVaultUnlock } from '../../styles/component/elementVaultUnlock'
import { observer } from 'mobx-react'
import { Vault } from '../../model/Vault'
import { exists } from '../../util/exists'

export interface IWaitingProps {
  start?: number
  onDone?: () => any
}

const thickness = elementVaultUnlock.active.border.thickness
const width = elementVaultUnlock.active.place.width
const height = elementVaultUnlock.active.place.height
const radius = elementVaultUnlock.inactive.borderRadius
const { box, width: outWidth, height: outHeight } = createBoxOutline(width, height, radius, 'inside', thickness)
const adjust = -thickness / 2
const viewBox = `${adjust} ${adjust} ${outWidth} ${outHeight}`
const textStyle: TextStyle = {
  ...elementVaultUnlock.waiting.style,
  position: 'absolute',
  width: outWidth,
  height: outHeight,
  fontStyle: 'italic'
}
const absolute: ViewStyle = { position: 'absolute' }

const container: ViewStyle = {
  flexGrow: 1,
  backgroundColor: elementVaultUnlock.backgroundColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

export const Waiting = observer(({ vault, onClose }: { vault: Vault, onClose?: () => any }): JSX.Element => {
  const offset = Math.max(1 - vault.expiresIn / vault.keepAlive, 0)
  const [closeCalled, setCloseCalled] = useState<boolean>(false)

  if (offset === 0 && closeCalled === false) {
    setCloseCalled(true)
    if (exists(onClose)) onClose()
  }

  return <View style={container}>
    {elementVaultUnlock.illustrationWaiting.img({ marginBottom: elementVaultUnlock.waiting.place.top - elementVaultUnlock.illustrationWaiting.place.bottom })}
    <View style={{ width: outWidth, height: outHeight, position: 'relative' }}>
      <Svg width={outWidth} height={outHeight} viewBox={viewBox} style={absolute}>
        <Path
          d={box(0, offset)}
          fill='none'
          stroke={elementVaultUnlock.inactive.border.fill.color}
          strokeWidth={elementVaultUnlock.inactive.border.thickness}
        />
      </Svg>
      <Svg width={outWidth} height={outHeight} viewBox={viewBox} style={absolute}>
        <Path
          d={box(offset, 1)}
          fill='none'
          stroke={elementVaultUnlock.active.border.fill.color}
          strokeWidth={thickness}
          strokeLinecap='round'
        />
      </Svg>
      <Text style={textStyle}>{elementVaultUnlock.waiting.text}</Text>
    </View>
  </View>
})
