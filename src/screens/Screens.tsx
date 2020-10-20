import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { elementBottomNav } from '../styles/design/layer/elementBottomNav'
import { IImageAsset, ILayer, ViewBorders } from '../styles/util/types'
import { SketchImage } from '../styles/util/react/SketchImage'
import { ImageAsset } from '../styles/design/ImageAsset'
import { SketchTextBoxView } from '../styles/util/react/SketchTextBox'
import { VaultsScreen } from './Vaults'
import { ConsentoContext } from '../model/Consento'
import { elementBottomNavVaultActive } from '../styles/design/layer/elementBottomNavVaultActive'
import { elementBottomNavVaultResting } from '../styles/design/layer/elementBottomNavVaultResting'
import { elementBottomNavRelationsActive } from '../styles/design/layer/elementBottomNavRelationsActive'
import { elementBottomNavRelationsResting } from '../styles/design/layer/elementBottomNavRelationsResting'
import { elementBottomNavConsentosActive } from '../styles/design/layer/elementBottomNavConsentosActive'
import { elementBottomNavConsentosResting } from '../styles/design/layer/elementBottomNavConsentosResting'
import { Vault } from './Vault'
import { RelationsScreen } from './Relations'
import { Config } from './Config'
import { NewRelation } from './NewRelation'
import { ConsentosScreen } from './Consentos'
import { isScreenshotEnabled } from '../util/screenshots'
import { TextBox } from '../styles/util/TextBox'
import { Camera } from './Camera'
import { RouteProp } from '@react-navigation/native'
import { useAutorun } from '../util/useAutorun'
import { Relation } from './Relation'
import { FileEditor } from './FileEditor'

const Stack = createStackNavigator()
const Tabs = createBottomTabNavigator()

const MainTabs = (): JSX.Element => {
  return <Tabs.Navigator
    initialRouteName='vaults'
    lazy
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
        tabBarIcon: ConsentosIcon,
        tabBarLabel: FocusLabel(elementBottomNavConsentosActive, elementBottomNavConsentosResting)
      }} />
    <Tabs.Screen
      name='relations' component={RelationsScreen} options={{
        tabBarIcon: FocusIcon(ImageAsset.iconRelationsActive, ImageAsset.iconRelationsIdle),
        tabBarLabel: FocusLabel(elementBottomNavRelationsActive, elementBottomNavRelationsResting)
      }} />
  </Tabs.Navigator>
}

const RelationRoute = ({ route }: { route: RouteProp<Record<string, object | undefined>, 'relation'> }): JSX.Element => {
  const relationId = (route.params as any)?.relation
  return <Relation relationId={relationId} />
}

const VaultRoute = ({ route }: { route: RouteProp<Record<string, object | undefined>, 'vault'> }): JSX.Element => {
  const vaultId = (route.params as any)?.vault
  return <Vault vaultId={vaultId} />
}

const EditorRoute = ({ route }: { route: RouteProp<Record<string, object | undefined>, 'editor'> }): JSX.Element => {
  const { vault, file } = (route.params as any) ?? {}
  return <FileEditor vaultId={vault} fileId={file} />
}

const CameraRoute = ({ route }: { route: RouteProp<Record<string, object | undefined>, 'camera'> }): JSX.Element => {
  const { vault } = (route.params as any) ?? {}
  return <Camera vaultId={vault} />
}

export const Screens = (): JSX.Element => {
  return <Stack.Navigator
    initialRouteName='main'
    mode='modal'
    screenOptions={{
      headerShown: false,
      animationEnabled: !isScreenshotEnabled
    }}>
    <Stack.Screen name='main' component={MainTabs} />
    <Stack.Screen name='config' component={Config} />
    <Stack.Screen name='newRelation' component={NewRelation} />
    <Stack.Screen name='vault' component={VaultRoute} />
    <Stack.Screen name='relation' component={RelationRoute} />
    <Stack.Screen name='editor' component={EditorRoute} />
    <Stack.Screen name='camera' component={CameraRoute} />
  </Stack.Navigator>
}

const FocusIcon = (focusedSrc: IImageAsset, regularSrc: IImageAsset) => {
  return ({ focused }: { focused: boolean }) => <SketchImage src={focused ? focusedSrc : regularSrc} />
}

const ConsentosIcon = ({ focused }: { focused: boolean }): JSX.Element => {
  const consento = useContext(ConsentoContext)
  const hasNewNotifications = useAutorun(() => {
    const count = consento?.user.newConsentosCount
    return count !== undefined && count > 0
  })
  return <SketchImage src={focused
    ? ImageAsset.iconConsentoActive
    : hasNewNotifications
      ? ImageAsset.iconConsentoNotificationNew
      : ImageAsset.iconConsentoIdle} />
}

const FocusLabel = (focusedStyle: ILayer<{ title: TextBox }>, regularStyle: ILayer<{ title: TextBox }>): (focused: { focused: boolean }) => JSX.Element => {
  return ({ focused }: { focused: boolean }): JSX.Element => {
    const src = (focused ? focusedStyle : regularStyle).layers.title
    return <SketchTextBoxView src={src} style={src.style} />
  }
}
