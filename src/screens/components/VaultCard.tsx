import React from 'react'
import { Text, View, ViewStyle, ImageStyle, TextStyle, TouchableOpacity } from 'react-native'
import { elementCardVaultClose } from '../../styles/component/elementCardVaultClose'
import { elementCardVaultOpen } from '../../styles/component/elementCardVaultOpen'
import { withNavigation, TNavigation } from '../navigation'

type VaultState = 'open' | 'locked' | 'unlocking'

const cardStyle: ViewStyle = {
  width: elementCardVaultClose.width,
  height: elementCardVaultClose.height,
  marginTop: 8,
  marginHorizontal: 10,
  marginBottom: 15
}

class VaultCardClass extends React.Component<{ item: any, navigation: TNavigation }, { state: VaultState }> {

  componentWillMount () {
    this.setState({
      state: 'locked'
    })
  }

  onPress () {
    this.props.navigation.navigate('vault', { vault: this.props.item.key })
  }

  render () {
    const proto = this.state.state === 'open' ? elementCardVaultOpen : elementCardVaultClose
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
