import React from 'react'
import { View, ViewStyle } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { createTabBar } from './components/createTabBar'
import { styles } from '../styles'
import { withNavigation, TNavigation } from './navigation'
import { elementSealVaultActive } from '../styles/component/elementSealVaultActive'
import { elementSealVaultIdle } from '../styles/component/elementSealVaultIdle'
import { elementVaultEmpty } from '../styles/component/elementVaultEmpty'
import { elementLocksEmpty } from '../styles/component/elementLocksEmpty'
import { ConsentoButton } from './components/ConsentoButton'
import { EmptyView } from './components/EmptyView'
import { Logs } from './Logs'

const lockStyle: ViewStyle = {
  height: elementSealVaultActive.height,
  borderBottomColor: elementSealVaultActive.borderBottom.border.fill.color,
  borderBottomWidth: elementSealVaultActive.borderBottom.border.thickness,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const VaultNavigator = createTabBar({
  vaultData: () => <EmptyView prototype={ elementVaultEmpty }/>,
  vaultLocks: () => <EmptyView prototype={ elementLocksEmpty }/>,
  vaultLog: () => <Logs/>
})

class VaultClass extends React.Component<{ navigation: TNavigation }, {}> {
  static router = VaultNavigator.router

  render () {
    const { navigation } = this.props
    const vault = navigation.state.params.vault
    return <View style={ styles.screen }>
      <TopNavigation title={ vault } back={ true } onEdit={ text => console.log(`changed text: ${text}`) } onDelete={ () => {} }/>
      <View style={ lockStyle }>
        <ConsentoButton style={ elementSealVaultIdle.disabled.place } title={ 'lock' } />
      </View>
      <View style={ lockStyle }>
        <ConsentoButton onPress={ () => {} } style={ elementSealVaultActive.enabled.place } title={ 'lock' } />
      </View>
      {
        <VaultNavigator navigation={ navigation }></VaultNavigator>
      }
    </View>
  }
}

export const Vault = withNavigation(VaultClass)
