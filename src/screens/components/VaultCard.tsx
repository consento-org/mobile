import React from 'react'
import { ViewStyle, TouchableOpacity } from 'react-native'
import { elementCardVaultClose } from '../../styles/component/elementCardVaultClose'
import { elementCardVaultPending } from '../../styles/component/elementCardVaultPending'
import { elementCardVaultOpen } from '../../styles/component/elementCardVaultOpen'
import { withNavigation, TNavigation } from '../navigation'
import { TVaultState, IVault } from '../../model/Vault'

const cardStyle: ViewStyle = {
  width: elementCardVaultClose.width,
  height: elementCardVaultClose.height,
  marginTop: 8,
  marginHorizontal: 10,
  marginBottom: 15
}

function getPrototype (state: TVaultState) {
  if (state === TVaultState.open) {
    return elementCardVaultOpen
  } else if (state === TVaultState.pending) {
    return elementCardVaultPending
  }
  return elementCardVaultClose
}

export const VaultCard = withNavigation(({ vault, navigation }: { vault: IVault, navigation: TNavigation }) => {
  const proto = getPrototype(vault.state)
  const onPress = () => navigation.navigate('vault', { vault: vault.key })

  return <TouchableOpacity style={ cardStyle } onPress={ onPress } activeOpacity={ 0.55 }>
    <proto.background.Render style={{ position: 'absolute' }}/>
    <proto.title.Render value={ vault.name } />
    <proto.lastAccess.Render />
    <proto.icon.Render style={{ position: 'absolute' }}/>
    <proto.status.Render style={{ position: 'absolute' }}/>
  </TouchableOpacity>
}))
