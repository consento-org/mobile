import React from 'react'
import { View, ViewStyle } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { styles } from '../styles'
import { withNavigation, TNavigation } from './navigation'
import { elementSealVaultActive } from '../styles/component/elementSealVaultActive'
import { elementSealVaultIdle } from '../styles/component/elementSealVaultIdle'
import { ConsentoButton } from './components/ConsentoButton'

const lockStyle: ViewStyle = {
  height: elementSealVaultActive.height,
  borderBottomColor: elementSealVaultActive.borderBottom.border.fill.color,
  borderBottomWidth: elementSealVaultActive.borderBottom.border.thickness,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}


class VaultClass extends React.Component<{ navigation: TNavigation }, {}> {
  render () {
    const vault = this.props.navigation.state.params.vault
    return <View style={ styles.screen }>
      <TopNavigation title={ vault } back={ true }/>
      <View style={ lockStyle }>
        <ConsentoButton style={ elementSealVaultIdle.disabled.place } title={ 'lock' } />
      </View>
      <View style={ lockStyle }>
        <ConsentoButton onPress={ () => {} } style={ elementSealVaultActive.enabled.place } title={ 'lock' } />
      </View>
    </View>
  }
}

export const Vault = withNavigation(VaultClass)
