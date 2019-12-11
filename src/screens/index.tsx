import React from 'react'
import { View } from 'react-native'
import { createAppContainer, withNavigation } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabBar } from './components/createBottomTabBar'
import { NotificationTestScreen } from './NotificationTest'
import { VaultsScreen } from './Vaults'
import { RelationsScreen } from './Relations'
import { ConsentosScreen } from './Consentos'
import { TNavigation } from './navigation'
import { Text } from 'react-native'
import { Vault, VaultRouter } from './Vault'
import { IVault, TVaultState } from '../model/Vault'
import { IConsento, IConsentoAccess, TConsentoType, TConsentoState } from '../model/Consento'
import { IRelation } from '../model/Relation'
import { NewRelation } from './NewRelation'
import { ConsentoContext } from '../model/ConsentoContext'
import { setup, IReceiver, IAnnonymous, IEncryptedMessage } from '@consento/api'
import { sodium } from '@consento/crypto/core/sodium'
import { ExpoTransport } from '@consento/notification-server'
import { getExpoToken } from '../util/getExpoToken'

const vaults: IVault[] = [
  {key: 'Devin'},
  {key: 'Dan'},
  {key: 'Dominic'},
  {key: 'Jackson'},
  {key: 'James'},
  {key: 'Joel'},
  {key: 'John'},
  {key: 'Jillian'},
  {key: 'Jimmy'},
  {key: 'Martin'},
  {key: 'Maz'},
  {key: 'Very Very Very Very Very Long Text Interrupted'},
  {key: 'VeryVeryVeryVeryVeryVeryLongTextUninterrupted'},
  {key: '日本語のテキスト、試すために'}
].map((obj, index) => {
  return {
    ...obj,
    name: obj.key,
    state:
      index % 3 === 0 ? TVaultState.open : 
      index % 3 === 1 ? TVaultState.pending : TVaultState.locked
  }
})

const relations: IRelation[] = [
  { key: 'a', name: 'XXX', image: 'abcd' }
]

const consentos: IConsento[] = [
  { type: TConsentoType.requestAccess },
  { type: TConsentoType.requestAccess },
  { type: TConsentoType.requestAccess },
  { type: TConsentoType.requestAccess }
].map((obj, index) => {
  return {
    ...obj,
    key: `consento-access-${index}`,
    relation: relations[0],
    vault: vaults[0],
    time: Date.now(),
    state: 
      index % 4 === 0 ? TConsentoState.accepted :
      index % 4 === 1 ? TConsentoState.denied :
      index % 4 === 2 ? TConsentoState.expired :
      TConsentoState.idle
  } as IConsentoAccess
}).concat([
  { type: TConsentoType.requestLockee },
  { type: TConsentoType.requestLockee },
  { type: TConsentoType.requestLockee },
  { type: TConsentoType.requestLockee }
].map((obj, index) => {
  return {
    ...obj,
    key: `consento-lockee-${index}`,
    relation: relations[0],
    vault: vaults[0],
    time: Date.now(),
    state: 
      index % 4 === 0 ? TConsentoState.accepted :
      index % 4 === 1 ? TConsentoState.denied :
      index % 4 === 2 ? TConsentoState.expired :
      TConsentoState.idle
  } as IConsentoAccess
}))

function getVaultByKey (key: string): IVault {
  for (const vault of vaults) {
    if (vault.key === key) {
      return vault
    }
  }
  return undefined
}

function init () {
  try {
    const AppNavigator = createStackNavigator({
      main: {
        path: '',
        screen: createBottomTabBar({
          vaults: () => <VaultsScreen vaults={ vaults } />,
          consentos: () => <ConsentosScreen consentos={ consentos }/>, 
          relations: () => <RelationsScreen />,
          notificationTest: () => <NotificationTestScreen />
        })
      },
      vault: {
        path: 'vault',
        screen: withNavigation(class extends React.Component<{ navigation: TNavigation }, {}> {
          static router = VaultRouter
          render () {
            const { navigation } = this.props
            const vaultKey = navigation.state.params.vault
            const vault = getVaultByKey(vaultKey)
            if (vault === undefined) {
              // TODO!
              return <View />
            }
            return <Vault vault={ vault } navigation={ navigation } />
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

    const Container = createAppContainer(AppNavigator)
    return () => <Container />
  } catch (err) {
    console.log(err)
    return () => <Text>{ 'Cant load it' }</Text>
  }
}
const Navigator = init()
const transport = new ExpoTransport({
  address: 'http://192.168.11.11:3000',
  getToken: getExpoToken
})
const api = setup({
  cryptoCore: sodium,
  notificationTransport: transport
})
transport.on('message', (receiver: string, message: any) => {
  console.log('received message', { receiver, message })
  api.notifications.handle(receiver, message)
})

export function Screens () {

  return <ConsentoContext.Provider value={ api }>
    <Navigator />
  </ConsentoContext.Provider>
}

export default Screens
