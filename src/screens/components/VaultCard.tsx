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

const bgStyle = Object.freeze(elementCardVaultClose.background.place.style({ position: 'absolute' } as ImageStyle))
const iconStyle = Object.freeze(elementCardVaultClose.icon.place.style({ position: 'absolute' } as ImageStyle))

function opened () {
  return <View>
    { elementCardVaultOpen.icon.img(iconStyle) }
    <Text style={ elementCardVaultOpen.status.styleAbsolute }>{ elementCardVaultOpen.status.text }</Text>
  </View>
}

function closed () {
  return <View>
    { elementCardVaultClose.icon.img(iconStyle) }
    <Text style={ elementCardVaultClose.status.styleAbsolute }>{ elementCardVaultClose.status.text }</Text>
  </View>
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
    return <TouchableOpacity style={ cardStyle } onPress={ this.onPress.bind(this) } activeOpacity={ 0.55 }>
      { elementCardVaultClose.background.img(bgStyle) }
      { elementCardVaultClose.icon.img(iconStyle) }
      { elementCardVaultClose.title.renderAbsolute(this.props.item.key) }
      { elementCardVaultClose.lastAccess.renderAbsolute(elementCardVaultClose.lastAccess.text) }
      { this.state.state === 'open' ? opened() : closed() } 
    </TouchableOpacity>
  }
}

export const VaultCard = withNavigation(VaultCardClass)
