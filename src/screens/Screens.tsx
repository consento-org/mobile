import React, { forwardRef, Ref, useContext } from 'react'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { elementBottomNav } from '../styles/design/layer/elementBottomNav'
import { IImageAsset, ILayer, ViewBorders } from '../styles/util/types'
import { SketchImage } from '../styles/util/react/SketchImage'
import { ImageAsset } from '../styles/design/ImageAsset'
import { TextBox } from '../styles/util/TextBox'
import { SketchTextBoxView } from '../styles/util/react/SketchTextBox'
import { VaultsScreen } from './Vaults'
import { ConsentoContext } from '../model/Consento'
import { VaultContext } from '../model/VaultContext'
import { elementBottomNavVaultActive } from '../styles/design/layer/elementBottomNavVaultActive'
import { elementBottomNavVaultResting } from '../styles/design/layer/elementBottomNavVaultResting'
import { elementBottomNavRelationsActive } from '../styles/design/layer/elementBottomNavRelationsActive'
import { elementBottomNavRelationsResting } from '../styles/design/layer/elementBottomNavRelationsResting'
import { elementBottomNavConsentosActive } from '../styles/design/layer/elementBottomNavConsentosActive'
import { elementBottomNavConsentosResting } from '../styles/design/layer/elementBottomNavConsentosResting'
import { Vault } from './Vault'
import { Vault as VaultModel } from '../model/Vault'
import { RelationsScreen } from './Relations'
import { RelationContext } from '../model/RelationContext'
import { Relation } from './Relation'
import { Relation as RelationModel } from '../model/Relation'
import { Config } from './Config'
import { NewRelation } from './NewRelation'
import { ConsentosScreen } from './Consentos'
/*
import { createAppContainer, withNavigation, withNavigationFocus } from '@react-navigation/native'
import { VaultsScreen } from './Vaults'
import { RelationsScreen } from './Relations'
import { ConsentosScreen } from './Consentos'
import { Vault, VaultRouter } from './Vault'
import { TNavigation } from './navigation'
import { NewRelation } from './NewRelation'
import { Vault as VaultModel } from '../model/Vault'
import { isImageFile, isTextFile } from '../model/VaultData'
import { RelationContext } from '../model/RelationContext'
import { VaultContext } from '../model/VaultContext'
import { Config } from './Config'
import { Camera } from './Camera'
import { TextEditor } from './TextEditor'
import { ImageEditor } from './ImageEditor'
import { ConsentoContext } from '../model/Consento'
import { useScreenshotEnabled } from '../util/screenshots'
import { ImageAsset } from '../styles/design/ImageAsset'
import { IImageAsset } from '../styles/util/types'

const noTransition = (): TransitionConfig & HeaderTransitionConfig => {
  return {
    transitionSpec: {
      duration: 0
    }
  } as any
}

const ConsentosIcon = observer(({ focused }: { focused: boolean }): IImageAsset => {
  const { user } = useContext(ConsentoContext)
  const hasNewNotifications = user.newConsentosCount > 0
  return focused
    ? ImageAsset.iconConsentoActive
    : hasNewNotifications
      ? ImageAsset.iconConsentoNotificationNew
      : ImageAsset.iconConsentoIdle
})
*/

const Stack = createStackNavigator()
const Tabs = createBottomTabNavigator()

const MainTaps = (): JSX.Element => {
  return <Tabs.Navigator
    initialRouteName='vaults'
    screenOptions={{
      unmountOnBlur: true
    }}
    tabBarOptions={{
      showLabel: true,
      activeBackgroundColor: elementBottomNav.backgroundColor,
      inactiveBackgroundColor: elementBottomNav.backgroundColor,
      style: {
        ...elementBottomNav.layers.borderTop.borderStyle(ViewBorders.top),
        height: elementBottomNav.place.height
      },
      tabStyle: {
        padding: elementBottomNav.layers.consento.place.bottom
      },
      labelPosition: 'below-icon'
    }}
  >
    <Tabs.Screen
      name='vaults' component={VaultsScreen} options={{
        tabBarIcon: FocusIcon(ImageAsset.iconVaultActive, ImageAsset.iconVaultIdle),
        tabBarLabel: FocusLabel(elementBottomNavVaultActive, elementBottomNavVaultResting)
      }} />
    <Tabs.Screen
      name='consentos' component={ConsentosScreen} options={{
        tabBarIcon: FocusIcon(ImageAsset.iconConsentoActive, ImageAsset.iconConsentoIdle),
        tabBarLabel: FocusLabel(elementBottomNavConsentosActive, elementBottomNavConsentosResting)
      }} />
    <Tabs.Screen
      name='relations' component={RelationsScreen} options={{
        tabBarIcon: FocusIcon(ImageAsset.iconRelationsActive, ImageAsset.iconRelationsIdle),
        tabBarLabel: FocusLabel(elementBottomNavRelationsActive, elementBottomNavRelationsResting)
      }} />
  </Tabs.Navigator>
}

export const Screens = observer(forwardRef((_, ref: Ref<any>): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  /*
  const isScreenshotEnabled = useScreenshotEnabled()
  const Container = (() => {
    {
      main: {
        path: '',
        screen: createBottomTabBar({
          vaults: {
            label: 'Vaults',
            screen: () => <VaultsScreen />,
            tabBarIcon: ({ focused }) => focused ? Asset.iconVaultActive().img() : Asset.iconVaultIdle().img()
          },
          consentos: {
            label: 'Consentos',
            screen: () => <ConsentosScreen />,
            tabBarIcon: ({ focused }: { focused: boolean }) => <ConsentosIcon focused={focused} />
          },
          relations: {
            label: 'Relations',
            screen: () => <RelationsScreen />,
            tabBarIcon: ({ focused }) => focused ? Asset.iconRelationsActive().img() : Asset.iconRelationsIdle().img()
          }
        })
      },
      vault: {
        path: 'vault',
        screen: withNavigation(class extends React.Component<{ navigation: TNavigation }, {}> {
          static router = VaultRouter
          render (): JSX.Element {
            const { navigation } = this.props
            const vaultKey = navigation.state.params.vault
            const vault = user.findVault(vaultKey)
            if (!(vault instanceof VaultModel)) {
              navigation.navigate('') // TODO: Return 404 alert message?
              return <></>
            }
            return <VaultContext.Provider value={{ vault }}>
              <Vault />
            </VaultContext.Provider>
          }
        })
      },
      relation: {
        path: 'relation',
        screen: withNavigation(({ navigation }: { navigation: TNavigation }): JSX.Element => {
          const relationKey = navigation.state.params.relation
          const relation = user.findRelation(relationKey)
          if (!(relation instanceof RelationModel)) {
            navigation.navigate('') // TODO: Return 404 alert message?
            return <></>
          }
          return <RelationContext.Provider value={{ relation }}>
            <Relation />
          </RelationContext.Provider>
        })
      },
      newRelation: {
        path: 'newRelation',
        screen: () => <NewRelation />
      },
      config: {
        path: 'config',
        screen: () => <Config />
      },
      camera: {
        path: 'camera',
        screen: withNavigationFocus(({ navigation, isFocused }: { navigation: TNavigation, isFocused: boolean }): JSX.Element => {
          if (!isFocused) {
            return <></>
          }
          const onPicture = navigation.state.params.onPicture
          const onClose = navigation.state.params.onClose
          return <Camera onPicture={onPicture} onClose={onClose} />
        })
      },
      editor: {
        path: 'editor',
        screen: withNavigationFocus(({ navigation, isFocused }: { navigation: TNavigation, isFocused: boolean }): JSX.Element => {
          if (!isFocused) {
            return <></>
          }
          const vaultKey = navigation.state.params.vault
          const vault = user.findVault(vaultKey)
          if (!(vault instanceof VaultModel)) {
            navigation.navigate('') // TODO: Return 404 alert message?
            return <></>
          }
          const fileKey = navigation.state.params.file
          const file = vault.findFile(fileKey)
          if (isImageFile(file)) {
            return <ImageEditor image={file} vault={vault} navigation={navigation} />
          }
          if (isTextFile(file)) {
            return <TextEditor textFile={file} vault={vault} navigation={navigation} />
          }
          navigation.navigate('') // TODO: Return 404 alert message?
          return <></>
        })
      }
    }, {
      headerMode: 'none',
      initialRouteKey: 'vaults',
      transitionConfig: isScreenshotEnabled ? noTransition : undefined
    }
    )
    return createAppContainer(AppNavigator)
  })()
  */
  return <Stack.Navigator
    initialRouteName='main'
    mode='modal'
    screenOptions={{
      headerShown: false
    }}>
    <Stack.Screen name='main'>{props => {
      /* eslint-disable react/prop-types */
      const navigation: StackNavigationProp<any> = props.navigation
      if (!navigation.isFocused()) return <></>
      return <MainTaps />
    }}</Stack.Screen>
    <Stack.Screen name='config' component={Config} />
    <Stack.Screen name='newRelation'>{props => {
      /* eslint-disable react/prop-types */
      const navigation: StackNavigationProp<any> = props.navigation
      if (!navigation.isFocused()) return <></>
      return <NewRelation />
    }}</Stack.Screen>
    <Stack.Screen name='vault'>{props => {
      /* eslint-disable react/prop-types */
      const navigation: StackNavigationProp<any> = props.navigation
      if (!navigation.isFocused()) return <></>
      const route = props.route
      const vaultKey = (route.params as any)?.vault
      const vault = user.findVault(vaultKey)
      if (!(vault instanceof VaultModel)) {
        navigation.navigate('') // TODO: Return 404 alert message?
        return <></>
      }
      return <VaultContext.Provider value={{ vault }}>
        <Vault />
      </VaultContext.Provider>
    }}</Stack.Screen>
    <Stack.Screen name='relation'>{({ navigation, route }) => {
      const relationKey = (route.params as any)?.relation
      const relation = user.findRelation(relationKey)
      if (!(relation instanceof RelationModel)) {
        navigation.navigate('') // TODO: Return 404 alert message?
        return <></>
      }
      return <RelationContext.Provider value={{ relation }}>
        <Relation />
      </RelationContext.Provider>
    }}</Stack.Screen>
  </Stack.Navigator>
}))

const FocusIcon = (focusedSrc: IImageAsset, regularSrc: IImageAsset) => {
  return ({ focused }: { focused: boolean }) => <SketchImage src={focused ? focusedSrc : regularSrc} />
}

const FocusLabel = (focusedStyle: ILayer<{ title: TextBox }>, regularStyle: ILayer<{ title: TextBox }>): (focused: { focused: boolean }) => JSX.Element => {
  return ({ focused }: { focused: boolean }): JSX.Element => {
    const src = (focused ? focusedStyle : regularStyle).layers.title
    return <SketchTextBoxView src={src} style={src.style} />
  }
}

const Sample = (): JSX.Element => <Text>Hi</Text>
