import React from 'react'
import { createAppContainer, NavigationContainerProps, NavigationContainerComponent } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabBar } from './components/createBottomTabBar'
import { NotificationTestScreen } from './NotificationTest'
import { VaultsScreen } from './Vaults'
import { RelationsScreen } from './Relations'
import { ConsentosScreen } from './Consentos'
import { Text } from 'react-native'
import { Vault } from './Vault'

function init () {
  try {
    const AppNavigator = createStackNavigator({
      main: {
        path: '',
        screen: createBottomTabBar({
          vaults: () => <VaultsScreen />,
          consentos: () => <ConsentosScreen />,
          relations: () => <RelationsScreen />,
          notificationTest: () => <NotificationTestScreen />
        })
      },
      vault: {
        path: 'vault',
        screen: Vault
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
