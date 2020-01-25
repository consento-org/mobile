import React, { ReactNode, FunctionComponent } from 'react'
import { Text } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { elementBottomNav } from '../../styles/component/elementBottomNav'
import { elementBottomNavConsentosActive } from '../../styles/component/elementBottomNavConsentosActive'
import { elementBottomNavConsentosResting } from '../../styles/component/elementBottomNavConsentosResting'
import { BottomTabBarOptions, NavigationBottomTabOptions, NavigationTabProp } from 'react-navigation-tabs/lib/typescript/src/types'
import { NavigationRouteConfigMap, NavigationRoute, NavigationParams, NavigationRouteConfig, CreateNavigatorConfig, NavigationTabRouterConfig } from 'react-navigation'

interface Config {
  lazy?: boolean
  tabBarComponent?: React.ComponentType<any>
  tabBarOptions?: BottomTabBarOptions
}

type NavigationTab = NavigationTabProp<NavigationRoute<NavigationParams>>

type BottomTabBarTabs = NavigationRouteConfigMap<NavigationBottomTabOptions, NavigationTab>
const config: CreateNavigatorConfig<
Partial<Config>,
NavigationTabRouterConfig,
Partial<NavigationBottomTabOptions>,
NavigationTabProp<NavigationRoute<NavigationParams>, any>
> = {
  tabBarOptions: {
    showLabel: true,
    activeBackgroundColor: elementBottomNav.backgroundColor,
    inactiveBackgroundColor: elementBottomNav.backgroundColor,
    style: {
      borderTopColor: elementBottomNav.borderTop.border.fill.color,
      borderTopWidth: elementBottomNav.borderTop.border.thickness,
      height: elementBottomNav.height
    },
    tabStyle: {
      padding: elementBottomNav.height - elementBottomNav.consento.place.bottom
    }
  }
}

export interface IBottomTabConfig {
  [key: string]: {
    label: string
    screen: FunctionComponent<any>
    tabBarIcon?: (props: {
      focused: boolean
      tintColor?: string
      horizontal?: boolean
    }) => React.ReactNode
  }
}

function createTabs (tabs: IBottomTabConfig): BottomTabBarTabs {
  const res = {}
  for (const key in tabs) {
    const { screen, label, tabBarIcon } = tabs[key]
    const tab: NavigationRouteConfig<NavigationBottomTabOptions, NavigationTab> = {
      path: key,
      screen,
      navigationOptions: {
        tabBarAccessibilityLabel: label,
        tabBarLabel: ({ focused }: { focused: boolean }) =>
          <Text style={focused ? elementBottomNavConsentosActive.title.style : elementBottomNavConsentosResting.title.style}>
            {label}
          </Text>,
        tabBarIcon
      }
    }
    res[key] = tab
  }
  return res
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createBottomTabBar (tabs: IBottomTabConfig) {
  return createBottomTabNavigator(createTabs(tabs), config)
}
