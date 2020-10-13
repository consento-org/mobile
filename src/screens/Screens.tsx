import React, { forwardRef, Ref, useContext } from 'react'
import { observer } from 'mobx-react'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { elementBottomNav } from '../styles/design/layer/elementBottomNav'
import { IImageAsset, ILayer, ViewBorders } from '../styles/util/types'
import { SketchImage } from '../styles/util/react/SketchImage'
import { ImageAsset } from '../styles/design/ImageAsset'
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
import { assertExists } from '../util/assertExists'
import { useScreenshotEnabled } from '../util/screenshots'
import { isImageFile, isTextFile } from '../model/VaultData'
import { ImageEditor } from './ImageEditor'
import { TextEditor } from './TextEditor'
import { TextBox } from '../styles/util/TextBox'
import { Camera } from './Camera'

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
        tabBarIcon: ({ focused }: { focused: boolean }) => <ConsentosIcon focused={focused} />,
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
  const consento = useContext(ConsentoContext)
  assertExists(consento)
  const { user } = consento
  const isScreenshotEnabled = useScreenshotEnabled()
  return <Stack.Navigator
    initialRouteName='main'
    mode='modal'
    screenOptions={{
      headerShown: false,
      animationEnabled: !isScreenshotEnabled
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
    <Stack.Screen name='editor'>{({ navigation, route }) => {
      const vaultKey = (route.params as any)?.vault
      const vault = user.findVault(vaultKey)
      if (!(vault instanceof VaultModel)) {
        navigation.navigate('') // TODO: Return 404 alert message?
        return <></>
      }
      const fileKey = (route.params as any)?.file
      const file = vault.findFile(fileKey)
      if (isImageFile(file)) {
        return <ImageEditor image={file} vault={vault} />
      }
      if (isTextFile(file)) {
        return <TextEditor textFile={file} vault={vault} />
      }
      navigation.navigate('') // TODO: Return 404 alert message?
      return <></>
    }}</Stack.Screen>
    <Stack.Screen name='camera'>{({ route }) => {
      console.log({ params: route.params })
      const { onPicture, onClose } = (route.params as any) ?? {}
      console.log({ onPicture, onClose })
      return <Camera onPicture={onPicture} onClose={onClose} />
    }}</Stack.Screen>
  </Stack.Navigator>
}))

const FocusIcon = (focusedSrc: IImageAsset, regularSrc: IImageAsset) => {
  return ({ focused }: { focused: boolean }) => <SketchImage src={focused ? focusedSrc : regularSrc} />
}

const ConsentosIcon = observer(({ focused }: { focused: boolean }) => {
  const consento = useContext(ConsentoContext)
  assertExists(consento)
  const { user } = consento
  const hasNewNotifications = user.newConsentosCount > 0
  return <SketchImage src={focused
    ? ImageAsset.iconConsentoActive
    : hasNewNotifications
      ? ImageAsset.iconConsentoNotificationNew
      : ImageAsset.iconConsentoIdle} />
})

const FocusLabel = (focusedStyle: ILayer<{ title: TextBox }>, regularStyle: ILayer<{ title: TextBox }>): (focused: { focused: boolean }) => JSX.Element => {
  return ({ focused }: { focused: boolean }): JSX.Element => {
    const src = (focused ? focusedStyle : regularStyle).layers.title
    return <SketchTextBoxView src={src} style={src.style} />
  }
}
