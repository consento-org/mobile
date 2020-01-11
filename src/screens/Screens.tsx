import React, { useContext } from 'react'
import { View } from 'react-native'
import { createAppContainer, withNavigation, NavigationContainer } from 'react-navigation'
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
import { Relation as RelationModel } from '../model/Relation'
import { ConsentoContext } from '../model/ConsentoContext'
import { RelationContext } from '../model/RelationContext'
import { VaultContext } from '../model/VaultContext'
import { Config } from './Config'

let Container: NavigationContainer

export function Screens (): JSX.Element {
  const { user } = useContext(ConsentoContext)
  if (Container === undefined) {
    const AppNavigator = createStackNavigator({
      main: {
        path: '',
        screen: createBottomTabBar({
          vaults: () => <VaultsScreen />,
          consentos: () => <ConsentosScreen />,
          relations: () => <RelationsScreen />
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
            if (vault instanceof VaultModel) {
              return <VaultContext.Provider value={{ vault }}>
                <Vault />
              </VaultContext.Provider>
            }
            return <View /> // TODO: Return 404?
          }
        })
      },
      relation: {
        path: 'relation',
        screen: withNavigation(class extends React.Component<{ navigation: TNavigation }, {}> {
          static router = VaultRouter
          render (): JSX.Element {
            const { navigation } = this.props
            const relationKey = navigation.state.params.relation
            const relation = user.findRelation(relationKey)
            if (relation instanceof RelationModel) {
              return <RelationContext.Provider value={{ relation }}>
                <Relation />
              </RelationContext.Provider>
            }
            return <View /> // TODO: Return 404?
          }
        })
      },
      newRelation: {
        path: 'newRelation',
        screen: () => <NewRelation />
      },
      config: {
        path: 'config',
        screen: () => <Config />
      }
    }, {
      headerMode: 'none',
      initialRouteKey: 'vaults'
    })

    Container = createAppContainer(AppNavigator)
  }
  return <Container />
}
