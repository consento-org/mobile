import React, { forwardRef, Ref, useContext } from 'react'
import { observer } from 'mobx-react'
import { Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { elementBottomNav } from '../styles/design/layer/elementBottomNav'
import { IImageAsset, ILayer, ViewBorders } from '../styles/util/types'
import { SketchImage } from '../styles/util/react/SketchImage'
import { ImageAsset } from '../styles/design/ImageAsset'
import { TextBox } from '../styles/util/TextBox'
import { SketchTextBoxView } from '../styles/util/react/SketchTextBox'
import { VaultsScreen } from './Vaults'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { ConsentoContext } from '../model/Consento'
import { Loading } from './components/Loading'
import { FileList } from './components/FileList'
import { PopupMenu } from './components/PopupMenu'
import { LockButton } from './components/LockButton'
import { ContextMenu } from './components/ContextMenu'
import { TopNavigation } from './components/TopNavigation'
import { SketchElement } from '../styles/util/react/SketchElement'
import { VaultContext } from '../model/VaultContext'
import { Logs } from './Logs'
import { elementTabBarTabActive } from '../styles/design/layer/elementTabBarTabActive'
import { elementTabBarTabResting } from '../styles/design/layer/elementTabBarTabResting'
import { elementBottomNavVaultActive } from '../styles/design/layer/elementBottomNavVaultActive'
import { elementBottomNavVaultResting } from '../styles/design/layer/elementBottomNavVaultResting'
import { elementBottomNavRelationsActive } from '../styles/design/layer/elementBottomNavRelationsActive'
import { elementBottomNavRelationsResting } from '../styles/design/layer/elementBottomNavRelationsResting'
import { elementBottomNavConsentosActive } from '../styles/design/layer/elementBottomNavConsentosActive'
import { elementBottomNavConsentosResting } from '../styles/design/layer/elementBottomNavConsentosResting'
import { Locks } from './components/Locks'
/*
import { createAppContainer, withNavigation, withNavigationFocus } from '@react-navigation/native'
import { VaultsScreen } from './Vaults'
import { RelationsScreen } from './Relations'
import { ConsentosScreen } from './Consentos'
import { Vault, VaultRouter } from './Vault'
import { Relation } from './Relation'
import { TNavigation } from './navigation'
import { NewRelation } from './NewRelation'
import { Vault as VaultModel } from '../model/Vault'
import { isImageFile, isTextFile } from '../model/VaultData'
import { Relation as RelationModel } from '../model/Relation'
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

const Tab = createMaterialTopTabNavigator()

function labelOptions (label: string): any {
  return {
    tabBarLabel: ({ focused }: { focused: boolean }) =>
      <SketchElement src={focused ? elementTabBarTabActive.layers.label : elementTabBarTabResting.layers.label} style={{ width: 120 }}>{label}</SketchElement>
  }
}

const VaultDisplay = (): JSX.Element => {
  const { user: { vaults } } = useContext(ConsentoContext)
  const [vault] = vaults
  const handleNameEdit = (): any => {}
  const handleDelete = (): any => {}
  const handleLock = (): any => {}
  return <PopupMenu><ContextMenu>
    <VaultContext.Provider value={{ vault }}>
      <View style={{ flexGrow: 1, display: 'flex' }}>
        <TopNavigation title={vault.name ?? '-vault-name-missing-'} titlePlaceholder={vault.humanId} back='vaults' onEdit={handleNameEdit} onDelete={handleDelete} />
        <LockButton onPress={handleLock} />
        <Tab.Navigator
          tabBarOptions={{
            indicatorStyle: {
              backgroundColor: elementTabBarTabActive.layers.bottomLine.svg?.stroke,
              height: elementTabBarTabActive.layers.bottomLine.svg?.strokeWidth ?? 1
            },
            pressColor: elementTabBarTabResting.layers.effect.fill.color,
            style: {
              backgroundColor: elementTabBarTabResting.backgroundColor,
              height: elementTabBarTabResting.place.height,
              shadowOpacity: 0,
              elevation: 0
            }
          }}>
          <Tab.Screen name='files' component={FileList} options={labelOptions('Files')} />
          <Tab.Screen name='locks' component={Locks} options={labelOptions('Locks')} />
          <Tab.Screen name='logs' component={Logs} options={labelOptions('Logs')} />
        </Tab.Navigator>
      </View>
    </VaultContext.Provider>
  </ContextMenu></PopupMenu>
}

export const Screens = observer(forwardRef((_, ref: Ref<any>): JSX.Element => {
  /*
  const { user } = useContext(ConsentoContext)
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
    screenOptions={{
      headerShown: false
    }}>
    <Stack.Screen name='vault' component={VaultDisplay} />
    <Stack.Screen name='main'>{() => <Tabs.Navigator
      initialRouteName='vaults'
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
        name='consentos' component={Sample} options={{
          tabBarIcon: FocusIcon(ImageAsset.iconConsentoActive, ImageAsset.iconConsentoIdle),
          tabBarLabel: FocusLabel(elementBottomNavConsentosActive, elementBottomNavConsentosResting)
        }} />
      <Tabs.Screen
        name='relations' component={Sample} options={{
          tabBarIcon: FocusIcon(ImageAsset.iconRelationsActive, ImageAsset.iconRelationsIdle),
          tabBarLabel: FocusLabel(elementBottomNavRelationsActive, elementBottomNavRelationsResting)
        }} />
    </Tabs.Navigator>}</Stack.Screen>
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
