import React from 'react'
import { View } from 'react-native'
import { createAppContainer, NavigationContainerProps, NavigationContainerComponent, withNavigation } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabBar } from './components/createBottomTabBar'
import { NotificationTestScreen } from './NotificationTest'
import { VaultsScreen } from './Vaults'
import { RelationsScreen } from './Relations'
import { ConsentosScreen } from './Consentos'
import { TNavigation } from './navigation'
import { Text } from 'react-native'
import { Vault, VaultRouter } from './Vault'
import { IVault, TVaultState } from '../model/Vault'

const list: IVault[] = [
  {key: 'Devin'},
  {key: 'Dan'},
  {key: 'Dominic'},
  {key: 'Jackson'},
  {key: 'James'},
  {key: 'Joel'},
  {key: 'John'},
  {key: 'Jillian'},
  {key: 'Jimmy'},
  {key: 'Martin'},
  {key: 'Maz'},
  {key: 'Very Very Very Very Very Long Text Interrupted'},
  {key: 'VeryVeryVeryVeryVeryVeryLongTextUninterrupted'},
  {key: '日本語のテキスト、試すために'}
].map((obj, index) => {
  return {
    ...obj,
    name: obj.key,
    state:
      index % 3 === 0 ? TVaultState.open : 
      index % 3 === 1 ? TVaultState.pending : TVaultState.locked
  }
})

function getVaultByKey (key: string): IVault {
  for (const vault of list) {
    if (vault.key === key) {
      return vault
    }
  }
  return undefined
}

function init () {
  try {
    const AppNavigator = createStackNavigator({
      main: {
        path: '',
        screen: createBottomTabBar({
          vaults: () => <VaultsScreen vaults={ list } />,
          consentos: () => <ConsentosScreen />,
          relations: () => <RelationsScreen />,
          notificationTest: () => <NotificationTestScreen />
        })
      },
      vault: {
        path: 'vault',
        screen: withNavigation(class extends React.Component<{ navigation: TNavigation }, {}> {
          static router = VaultRouter
          render () {
            const { navigation } = this.props
            const vaultKey = navigation.state.params.vault
            const vault = getVaultByKey(vaultKey)
            if (vault === undefined) {
              // TODO!
              return <View />
            }
            return <Vault vault={ vault } navigation={ navigation } />
          }
        })
      }
    }, {
      headerMode: 'none',
      initialRouteKey: 'vaults'
    })
    return (createAppContainer(AppNavigator) as any) as {
      new(props: NavigationContainerProps, context?: any): NavigationContainerComponent
    }
  } catch (err) {
    console.log(err)
    return <Text>{ 'Cant load it' }</Text>
  }
}

export const Screens = init()

export default Screens
