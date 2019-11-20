import React from 'react'
import { ViewStyle, TouchableOpacity } from 'react-native'
import { elementCardVaultClose } from '../../styles/component/elementCardVaultClose'
import { elementCardVaultPending } from '../../styles/component/elementCardVaultPending'
import { elementCardVaultOpen } from '../../styles/component/elementCardVaultOpen'
import { withNavigation, TNavigation } from '../navigation'

type VaultState = 'open' | 'locked' | 'pending'

const cardStyle: ViewStyle = {
  width: elementCardVaultClose.width,
  height: elementCardVaultClose.height,
  marginTop: 8,
  marginHorizontal: 10,
  marginBottom: 15
}

function getPrototype (state: VaultState) {
  if (state === 'open') {
    return elementCardVaultOpen
  } else if (state === 'pending') {
    return elementCardVaultPending
  }
  return elementCardVaultClose
}

class VaultCardClass extends React.Component<{ item: any, navigation: TNavigation, state: VaultState }> {

  componentWillMount () {
    this.setState({
      state: 'locked'
    })
  }

  onPress () {
    this.props.navigation.navigate('vault', { vault: this.props.item.key })
  }

  render () {
    const proto = getPrototype(this.props.state)
    return <TouchableOpacity style={ cardStyle } onPress={ this.onPress.bind(this) } activeOpacity={ 0.55 }>
      <proto.background.Render style={{ position: 'absolute' }}/>
      <proto.title.Render value={ this.props.item.key } />
      <proto.lastAccess.Render />
      <proto.icon.Render style={{ position: 'absolute' }}/>
      <proto.status.Render style={{ position: 'absolute' }}/>
    </TouchableOpacity>
  }
}

export const VaultCard = withNavigation(VaultCardClass)
