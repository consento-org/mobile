import React, { useState } from 'react'
import Svg, { Path } from 'react-native-svg'
import { View, TextStyle, StyleSheet } from 'react-native'
import { createBoxOutline } from './createBoxOutline'
import { observer } from 'mobx-react'
import { Vault } from '../../model/Vault'
import { elementVaultUnlock } from '../../styles/design/layer/elementVaultUnlock'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { ViewBorders } from '../../styles/util/types'
import { exists } from '../../styles/util/lang'

export interface IWaitingProps {
  start?: number
  onDone?: () => any
}

const { active, illustrationWaiting, waiting, inactive } = elementVaultUnlock.layers

const thickness = active.svg?.strokeWidth ?? 0
const outline = createBoxOutline(
  active.place.width,
  active.place.height,
  inactive.borderStyle(ViewBorders.all).borderRadius ?? 0,
  'inside',
  thickness
)
const adjust = -thickness / 2
const viewBox = `${adjust.toString()} ${adjust.toString()} ${outline.width.toString()} ${outline.height.toString()}`

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: elementVaultUnlock.backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  /* eslint-disable @typescript-eslint/consistent-type-assertions */
  waiting: {
    position: 'absolute',
    width: outline.width,
    height: outline.height,
    fontStyle: 'italic'
  } as TextStyle,
  absolute: {
    position: 'absolute'
  },
  rect: {
    position: 'relative',
    width: outline.width,
    height: outline.height
  }
})

export const Waiting = observer(({ vault, onClose }: { vault: Vault, onClose?: () => any }): JSX.Element => {
  const offset = Math.max(1 - vault.expiresIn / vault.keepAlive, 0)
  const [closeCalled, setCloseCalled] = useState<boolean>(false)

  if (offset === 0 && !closeCalled) {
    setCloseCalled(true)
    if (exists(onClose)) onClose()
  }

  return <View style={styles.container}>
    <SketchElement src={illustrationWaiting} style={{ marginBottom: waiting.place.spaceY(illustrationWaiting.place) }} />
    <View style={styles.rect}>
      <Svg width={outline.width} height={outline.height} viewBox={viewBox} style={styles.absolute}>
        {
          React.createElement(Path, {
            d: outline.box(0, offset),
            fill: 'none',
            ...inactive.svg
          })
        }
      </Svg>
      <Svg width={outline.width} height={outline.height} viewBox={viewBox} style={styles.absolute}>
        {
          React.createElement(Path, {
            d: outline.box(offset, 1),
            fill: 'none',
            ...active.svg
          })
        }
      </Svg>
      <SketchElement src={waiting} style={styles.waiting} />
    </View>
  </View>
})
