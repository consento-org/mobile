import React from 'react'
import { View, AppState, Text } from 'react-native'
import { createAppContainer, withNavigation } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Constants from 'expo-constants'
import { createBottomTabBar } from './components/createBottomTabBar'
import { VaultsScreen } from './Vaults'
import { RelationsScreen } from './Relations'
import { ConsentosScreen } from './Consentos'
import { TNavigation } from './navigation'
import { Vault, VaultRouter } from './Vault'
import { Vault as VaultModel } from '../model/Vault'
import { User as UserModel, User } from '../model/User'
import { Relation as RelationModel } from '../model/Relation'
import { ConsentoBecomeLockee, ConsentoUnlockVault } from '../model/Consento'
import { NewRelation } from './NewRelation'
import { ConsentoContext } from '../model/ConsentoContext'
import { setup, IAPI } from '@consento/api'
import { sodium } from '@consento/crypto/core/sodium'
import { ExpoTransport } from '@consento/notification-server'
import { getExpoToken } from '../util/getExpoToken'
import { rootRef, registerRootStore, ArraySet, customRef, findParent } from 'mobx-keystone'
import { Connection } from '../model/Connection'
import { first } from '../util/first'
import { VaultRef, findVault } from '../model/VaultRef'
import { RelationRef } from '../model/RelationRef'

let ctx: { api: IAPI, user: User }
let Navigator: () => JSX.Element = () => <></>

try {
const users = new ArraySet<User>({ items: [] })
registerRootStore(users)

const user = new UserModel({})
users.add(user)
;[
  'Devin',
  'Dan',
  'Dominic',
  'Jackson',
  'James',
  'Joel',
  'John',
  'Jillian',
  'Jimmy',
  'Martin',
  'Maz',
  'Very Very Very Very Very Long Text Interrupted',
  'VeryVeryVeryVeryVeryVeryLongTextUninterrupted',
  '日本語のテキスト、試すために'
].forEach((name: string) => {
  user.vaults.add(
    new VaultModel({
      name
    })
  )
})
;['frank'].forEach(name => {
  user.relations.add(new RelationModel({
    name,
    connection: new Connection({
      sendKey: 'abcd',
      receiveKey: 'def'
    })
  }))
})

;[ 0, 1, 2, 3 ].forEach(index => {
  const consento = new ConsentoUnlockVault({
    vault: VaultRef(first(user.vaults).$modelId),
    relation: RelationRef(first(user.relations).$modelId),
    time: index % 4 === 2 ? 0 : Date.now()
  })
  if (index % 4 === 0) {
    consento.accept()
  } else if (index % 4 === 1) { 
    consento.deny()
  }
  user.consentos.add(consento)
})

;[ 'someVault', 'someVault', 'someVault', 'someVault' ].forEach((title, index) => {
  const consento = new ConsentoBecomeLockee({
    relation: RelationRef(first(user.relations).$modelId),
    title,
    time: index % 4 === 2 ? 0 : undefined
  })
  if (index % 4 === 0) {
    consento.accept()
  } else if (index % 4 === 1) { 
    consento.deny()
  }
  user.consentos.add(consento)
})

const init = () => {
  try {
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
          render () {
            const { navigation } = this.props
            const vaultKey = navigation.state.params.vault
            const vault = findVault(user, vaultKey)
            if (vault instanceof VaultModel) {
              // TODO!
              return <Vault vault={ vault } navigation={ navigation } />
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

    const Container = createAppContainer(AppNavigator)
    return () => <Container />
  } catch (err) {
    console.log(err)
    return () => <Text>{ 'Cant load it' }</Text>
  }
}
Navigator = init()
const transport = new ExpoTransport({
  address: Constants.isDevice ? 'http://192.168.11.11:3000' : 'http://10.0.2.2:3000',
  getToken: getExpoToken
})
const api = setup({
  cryptoCore: sodium,
  notificationTransport: transport
})
let cancel
const stateChange = state => {
  if (state !== "background") {
    if (cancel === undefined) {
      cancel = transport.connect()
    }
  } else {
    if (cancel !== undefined) {
      cancel()
      cancel = undefined
    }
  }
}
AppState.addEventListener('change', stateChange)
stateChange(AppState.currentState)

ctx = { api, user }

} catch (err) {
  setTimeout(() => {
    console.error(err)
  }, 100)
}

export function Screens () {
  return <ConsentoContext.Provider value={ctx}>
    <Navigator />
  </ConsentoContext.Provider>
}

export default Screens
