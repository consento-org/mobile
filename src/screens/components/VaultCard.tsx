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

function getPrototype (state: TVaultState): IVaultPrototype {
  if (state === TVaultState.loading) {
    return elementCardVaultLoading
  } else if (state === TVaultState.open) {
    return elementCardVaultOpen
  } else if (state === TVaultState.pending) {
    return elementCardVaultPending
  }
  return elementCardVaultClose
}

interface IStyles {
  title: TextStyle
  icon: ImageStyle
  background: ImageStyle
  lastAccess: TextStyle
  status: TextStyle
}

const stylesByProto = new WeakMap<PropType<IVaultPrototype, 'layers'>, IStyles>()
function getProtoStyles (layers: PropType<IVaultPrototype, 'layers'>): IStyles {
  let styles = stylesByProto.get(layers)
  if (styles === undefined) {
    const { icon, title, background, lastAccess, status } = layers
    styles = StyleSheet.create({
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
        left: background.place.left,
        width: background.place.width
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
    stylesByProto.set(layers, styles)
  }
  return styles
}

export const VaultCard = observer(({ vault }: { vault: VaultModel }) => {
  const { layers } = getPrototype(vault.state)
  const onPress = (): void => {
    navigate('vault', { vault: vault.$modelId })
  }
  const styles = getProtoStyles(layers)
  return <TouchableOpacity style={VAULT_STYLE} onPress={onPress} activeOpacity={0.55} disabled={vault.isLoading}>
    <SketchElement src={layers.background} style={styles.background} />
    <SketchElement src={layers.title} style={styles.title} value={vault.name} />
    <SketchElement src={layers.lastAccess} style={styles.lastAccess} value={vault.humanId} />
    <SketchElement src={layers.icon} style={styles.icon} />
    <SketchElement src={layers.status} style={styles.status} />
  </TouchableOpacity>
})
