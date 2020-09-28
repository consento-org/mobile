import { FunctionComponent } from 'react'
import { createMaterialTopTabNavigator, NavigationMaterialTabOptions, NavigationTabProp } from 'react-navigation-tabs'
import { NavigationRouteConfigMap, NavigationRoute, NavigationParams, NavigationRouteConfig } from 'react-navigation'
import { elementTabBarTabActive } from '../../styles/design/layer/elementTabBarTabActive'
import { elementTabBarTabResting } from '../../styles/design/layer/elementTabBarTabResting'

const config = {
  tabBarOptions: {
    activeTintColor: elementTabBarTabActive.layers.label.style.color,
    indicatorStyle: {
      backgroundColor: elementTabBarTabActive.layers.bottomLine.border.fill.color,
      height: elementTabBarTabActive.layers.bottomLine.border.thickness
    },
    pressColor: elementTabBarTabResting.layers.effect.fill.color,
    labelStyle: elementTabBarTabResting.layers.label.style,
    upperCaseLabel: elementTabBarTabResting.layers.label.style.textTransform === 'uppercase',
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
