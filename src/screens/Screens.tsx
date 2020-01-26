import React, { useContext, forwardRef, Ref } from 'react'
import { observer } from 'mobx-react'
import { createAppContainer, withNavigation, withNavigationFocus } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabBar } from './components/createBottomTabBar'
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
import { Asset } from '../Asset'
import { TransitionConfig, HeaderTransitionConfig } from 'react-navigation-stack/lib/typescript/types'
import { useScreenshotEnabled } from '../util/screenshots'

const noTransition = (): TransitionConfig & HeaderTransitionConfig => {
  return {
    transitionSpec: {
      duration: 0
    }
  } as any
}

const ConsentosIcon = observer(({ focused }: { focused: boolean }): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  const hasNewNotifications = user.newConsentosCount > 0
  return focused
    ? Asset.iconConsentoActive().img()
    : hasNewNotifications
      ? Asset.iconConsentoNotificationNew().img()
      : Asset.iconConsentoIdle().img()
})

export const Screens = observer(forwardRef((_, ref: Ref<any>): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  const isScreenshotEnabled = useScreenshotEnabled()
  const Container = (() => {
    const AppNavigator = createStackNavigator({
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
    })
    return createAppContainer(AppNavigator)
  })()
  return <Container ref={ref} />
}))
