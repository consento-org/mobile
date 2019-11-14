import { ReactNode } from 'react'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { elementTabBarTabActive } from '../../styles/component/elementTabBarTabActive'
import { elementTabBarTabResting } from '../../styles/component/elementTabBarTabResting'
import { resources } from '../../resources'

const config = {
  tabBarOptions: {
    activeTintColor: elementTabBarTabActive.label.style.color,
    indicatorStyle: {
      backgroundColor: elementTabBarTabActive.bottomLine.border.fill.color,
      height: elementTabBarTabActive.bottomLine.border.thickness
    },
    pressColor: elementTabBarTabResting.effect.fill.color,
    labelStyle: elementTabBarTabResting.label.style,
    upperCaseLabel: elementTabBarTabResting.label.style.textTransform === 'uppercase',
    style: {
      backgroundColor: elementTabBarTabResting.backgroundColor,
      shadowOpacity: 0,
      elevation: 0,
      height: elementTabBarTabResting.height
    }
  }
}

const { t } = resources.ctx('navigation')

function createTabs (tabs: { [key: string]: () => ReactNode }) {
  const res = {}
  for (const key in tabs) {
    res[t(key)] = {
      path: key,
      screen: tabs[key]
    }
  }
  return res
}

export function createTabBar (tabs: { [key: string]: () => ReactNode }) {
  return createMaterialTopTabNavigator(createTabs(tabs), config)
}
