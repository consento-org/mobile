import { FunctionComponent } from 'react'
import { createMaterialTopTabNavigator, NavigationMaterialTabOptions, NavigationTabProp } from 'react-navigation-tabs'
import { elementTabBarTabActive } from '../../styles/component/elementTabBarTabActive'
import { elementTabBarTabResting } from '../../styles/component/elementTabBarTabResting'
import { NavigationRouteConfigMap, NavigationRoute, NavigationParams, NavigationRouteConfig } from 'react-navigation'

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

export interface ITabConfig {
  [key: string]: {
    label: string
    screen: FunctionComponent<any>
  }
}

type NavigationTab = NavigationTabProp<NavigationRoute<NavigationParams>, any>
type BottomTabBarTabs = NavigationRouteConfigMap<NavigationMaterialTabOptions, NavigationTab>

function createTabs (tabs: ITabConfig): BottomTabBarTabs {
  const res = {}
  for (const key in tabs) {
    const { label, screen } = tabs[key]
    const tab: NavigationRouteConfig<NavigationMaterialTabOptions, NavigationTab> = {
      path: key,
      screen
    }
    res[label] = tab
  }
  return res
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createTabBar (tabs: ITabConfig) {
  return createMaterialTopTabNavigator(createTabs(tabs), config)
}
