import { createAppContainer, NavigationContainerProps, NavigationContainerComponent } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { NotificationTestScreen } from './NotificationTest'
import { ReactNode } from 'react'
import { VaultsScreen } from './Vaults'
import { RelationsScreen } from './Relations'
import { ConsentosScreen } from './Consentos'
import { tabBarOptions } from '../styles'
import { resources } from '../resources'

const { t, icon } = resources.ctx('navigation')

function tabs (tabs: { [key: string]: ReactNode }) {
  const res = {}
  for (const key in tabs) {
    res[key] = {
      screen: tabs[key],
      navigationOptions: {
        tabBarIcon: icon(key),
        title: t(key)
      }
    }
  }
  return res
}

const AppNavigator = createStackNavigator({
  main: {
    path: '',
    screen: createBottomTabNavigator(tabs({
      relations: RelationsScreen,
      consentos: ConsentosScreen,
      vaults: VaultsScreen,
      notificationTest: NotificationTestScreen
    }), {
      tabBarOptions
    })
  }
}, {
  headerMode: 'none',
  initialRouteKey: 'vaults'
})

export const Screens = (createAppContainer(AppNavigator) as any) as {
  new(props: NavigationContainerProps, context?: any): NavigationContainerComponent
}

export default Screens
