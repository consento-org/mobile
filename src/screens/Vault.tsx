import React from 'react'
import { View, Text } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { styles } from '../styles'
import { withNavigation, TNavigation } from './navigation'

class VaultClass extends React.Component<{ navigation: TNavigation }, {}> {
  render () {
    const vault = this.props.navigation.state.params.vault
    return <View style={ styles.screen }>
      <TopNavigation title={ vault } back={ true }/>
    </View>
  }
}

export const Vault = withNavigation(VaultClass)
