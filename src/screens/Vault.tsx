import React from 'react'
import { View, Text, ViewStyle } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { styles } from '../styles'
import { withNavigation, TNavigation } from './navigation'
import { elementSealVaultActive } from '../styles/component/elementSealVaultActive'
import { Slice9Button } from '../Slice9Button'

const lockStyle: ViewStyle = {
  height: elementSealVaultActive.height,
  borderBottomColor: elementSealVaultActive.borderBottom.border.fill.color,
  borderBottomWidth: elementSealVaultActive.borderBottom.border.thickness,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const shadow: ViewStyle = {
  width: elementSealVaultActive.enabled.component.width,
  height: elementSealVaultActive.enabled.component.height
}

class VaultClass extends React.Component<{ navigation: TNavigation }, {}> {
  render () {
    const vault = this.props.navigation.state.params.vault
    return <View style={ styles.screen }>
      <TopNavigation title={ vault } back={ true }/>
      <View style={ lockStyle }>
        <Slice9Button label={ 'lock' } prototype={ elementSealVaultActive.enabled.component } style={{ width: elementSealVaultActive.enabled.place.width }} />
      </View>
    </View>
  }
}

export const Vault = withNavigation(VaultClass)
