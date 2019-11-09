import React from 'react'
import { createAppContainer, NavigationContainerProps, NavigationContainerComponent } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { NotificationTestScreen } from './NotificationTest'
import { ReactNode } from 'react'
import { VaultsScreen } from './Vaults'
import { RelationsScreen } from './Relations'
import { ConsentosScreen } from './Consentos'
import { resources } from '../resources'
import { Text, StyleSheet } from 'react-native'
import { elementBottomNavConsentosResting } from '../styles/component/elementBottomNavConsentosResting'
import { elementBottomNavConsentosActive } from '../styles/component/elementBottomNavConsentosActive'
import { BottomTabBarOptions } from 'react-navigation-tabs/src/types'
import { elementBottomNav } from '../styles/component/elementBottomNav'
import { Vault } from './Vault'

// https://reactnavigation.org/docs/en/bottom-tab-navigator.html#bottomtabnavigatorconfig
const tabBarOptions: BottomTabBarOptions = {
  showLabel: true,
  activeBackgroundColor: elementBottomNav.backgroundColor,
  inactiveBackgroundColor: elementBottomNav.backgroundColor,
  ... StyleSheet.create({
    style: {
      borderTopColor: elementBottomNav.borderTop.border.fill.color,
      borderTopWidth: elementBottomNav.borderTop.border.thickness,
      height: elementBottomNav.height
    },
    tabStyle: {
      padding: elementBottomNav.height - elementBottomNav.consento.place.bottom
    }
  })
}

function init () {
  try {
    const { t, icon } = resources.ctx('navigation')
    const tabs = (tabs: { [key: string]: ReactNode }) => {
      const res = {}
      for (const key in tabs) {
        // console.log(icon(key))
        res[key] = {
          path: key,
          screen: tabs[key],
          navigationOptions: {
            tabBarLabel: ({ focused }) => {
              return <Text style={ focused ? elementBottomNavConsentosActive.title.style : elementBottomNavConsentosResting.title.style }>{ t(key) }</Text>
            },
            tabBarIcon: opts => icon(key, opts),
          }
        }
      }
      return res
    }
    const AppNavigator = createStackNavigator({
      main: {
        path: '',
        screen: createBottomTabNavigator(tabs({
          vaults: VaultsScreen,
          consentos: ConsentosScreen,
          relations: RelationsScreen,
          notificationTest: NotificationTestScreen
        }), {
          tabBarOptions
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
