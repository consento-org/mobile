import React from 'react'
import { TouchableOpacity, StyleSheet, ImageStyle, TextStyle } from 'react-native'
import { TVaultState, Vault as VaultModel } from '../../model/Vault'
import { observer } from 'mobx-react'
import { elementCardVaultClose } from '../../styles/design/layer/elementCardVaultClose'
import { elementCardVaultLoading } from '../../styles/design/layer/elementCardVaultLoading'
import { elementCardVaultOpen } from '../../styles/design/layer/elementCardVaultOpen'
import { elementCardVaultPending } from '../../styles/design/layer/elementCardVaultPending'
import { ImagePlacement } from '../../styles/util/ImagePlacement'
import { TextBox } from '../../styles/util/TextBox'
import { ILayer } from '../../styles/util/types'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { navigate } from '../../util/navigate'
import { PropType } from '../../util/PropType'

export const VAULT_STYLE = StyleSheet.create({
  card: {
    width: elementCardVaultClose.place.width,
    height: elementCardVaultClose.place.height,
    marginTop: 8,
    marginHorizontal: 10,
    marginBottom: 15
  }
}).card

type IVaultPrototype = ILayer<{
  background: ImagePlacement
  title: TextBox
  lastAccess: TextBox
  status: TextBox
  icon: ImagePlacement
}>

interface IStyles {
  title: TextStyle
  icon: ImageStyle
  background: ImageStyle
  lastAccess: TextStyle
  status: TextStyle
}

interface IStateInfo {
  layers: PropType<IVaultPrototype, 'layers'>
  styles: IStyles
}

const styleByState: Record<TVaultState, IStateInfo> = {
  [TVaultState.loading]: createVaultStyle(elementCardVaultLoading),
  [TVaultState.open]: createVaultStyle(elementCardVaultOpen),
  [TVaultState.pending]: createVaultStyle(elementCardVaultPending),
  [TVaultState.locked]: createVaultStyle(elementCardVaultClose)
}

function createVaultStyle (proto: IVaultPrototype): IStateInfo {
  const { layers } = proto
  const { icon, title, background, lastAccess, status } = layers
  return {
    layers,
    styles: StyleSheet.create({
      icon: {
        position: 'absolute',
        top: icon.place.top,
        left: icon.place.left
      },
      title: {
        position: 'absolute',
        top: title.place.top,
        left: title.place.left,
        width: title.place.width
      },
      background: {
        position: 'absolute',
        top: background.place.top,
        left: background.place.left
      },
      lastAccess: {
        position: 'absolute',
        top: lastAccess.place.top,
        left: lastAccess.place.left,
        width: lastAccess.place.width
      },
      status: {
        position: 'absolute',
        top: status.place.top,
        left: status.place.left,
        width: status.place.width
      }
    })
  }
}

export const VaultCard = observer(({ vault }: { vault: VaultModel }) => {
  const onPress = (): void => navigate('vault', { vault: vault.$modelId })
  const { styles, layers } = styleByState[vault.state]
  const hasName = vault.name !== ''
  return <TouchableOpacity style={VAULT_STYLE} onPress={onPress} activeOpacity={0.55} disabled={vault.isLoading}>
    <SketchElement src={layers.background} style={styles.background} />
    <SketchElement src={layers.title} style={styles.title} value={hasName ? vault.name : vault.humanId} />
    {hasName ? <SketchElement src={layers.lastAccess} style={styles.lastAccess} value={vault.humanId} /> : undefined}
    <SketchElement src={layers.icon} style={styles.icon} />
    <SketchElement src={layers.status} style={styles.status} />
  </TouchableOpacity>
})
