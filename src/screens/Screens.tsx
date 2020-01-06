import React, { useContext } from 'react'
import { View } from 'react-native'
import { createAppContainer, withNavigation } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabBar } from './components/createBottomTabBar'
import { VaultsScreen } from './Vaults'
import { RelationsScreen } from './Relations'
import { ConsentosScreen } from './Consentos'
import { Vault, VaultRouter } from './Vault'
import { Relation } from './Relation'
import { TNavigation } from './navigation'
import { NewRelation } from './NewRelation'
import { findVault } from '../model/VaultRef'
import { findRelation } from '../model/RelationRef'
import { Vault as VaultModel } from '../model/Vault'
import { Relation as RelationModel } from '../model/Relation'
import { ConsentoContext } from '../model/ConsentoContext'

let Container

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
            const vault = findVault(user, vaultKey)
            if (vault instanceof VaultModel) {
              // TODO!
              return <Vault vault={vault} />
            }
            return <View />
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
            const relation = findRelation(user, relationKey)
            if (relation instanceof RelationModel) {
              // TODO!
              return <Relation relation={relation} />
            }
            return <View />
          }
        })
      },
      newRelation: {
        path: 'newRelation',
        screen: () => <NewRelation />
      }
    }, {
      headerMode: 'none',
      initialRouteKey: 'vaults'
    })

    Container = createAppContainer(AppNavigator)
  }
  return <Container />
}