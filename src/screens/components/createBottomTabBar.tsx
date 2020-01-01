import React, { ReactNode } from 'react'
import { Text } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { elementBottomNav } from '../../styles/component/elementBottomNav'
import { elementBottomNavConsentosActive } from '../../styles/component/elementBottomNavConsentosActive'
import { elementBottomNavConsentosResting } from '../../styles/component/elementBottomNavConsentosResting'
import { resources } from '../../resources'

// https://reactnavigation.org/docs/en/bottom-tab-navigator.html#bottomtabnavigatorconfig
const config = {
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

const { t, icon } = resources.ctx('navigation')

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createTabs (tabs: { [key: string]: () => ReactNode }) {
  const res = {}
  for (const key in tabs) {
    res[key] = {
      path: key,
      screen: tabs[key],
      navigationOptions: {
        tabBarLabel: ({ focused }: { focused: boolean }) => <Text
          style={focused ? elementBottomNavConsentosActive.title.style : elementBottomNavConsentosResting.title.style}>
          {t(key)}
        </Text>,
        tabBarIcon: opts => icon(key, opts)
      }
    }
  }
  return res
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createBottomTabBar (tabs: { [key: string]: () => ReactNode}) {
  return createBottomTabNavigator(createTabs(tabs), config)
}
