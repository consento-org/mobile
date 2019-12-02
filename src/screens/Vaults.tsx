import React from 'react'
import { connect } from 'react-redux'
import { View, ViewStyle, ScrollView } from 'react-native'
import { VaultCard } from './components/VaultCard'
import { styles } from '../styles'
import { TopNavigation } from './components/TopNavigation'
import { Asset } from '../Asset'
import { Waiting } from './components/Waiting'
import { IVault, TVaultState } from '../model/Vault'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({})

const listStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 20
}

const list: IVault[] = [
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
      index % 3 === 1 ? TVaultState.pending : TVaultState.pending
  }
})

const AddButton = Asset.buttonAddHexagonal().component

function Open ({}) {
  return <View style={ styles.screen }>
    <TopNavigation title="Vaults"/>
    <ScrollView centerContent={ true }>
      <View style={ listStyle }>
      {
        list.map(vault => <VaultCard key={ vault.key } vault={ vault } />
        )
      }
      </View>
    </ScrollView>
    <AddButton style={{ position: 'absolute', right: 10, bottom: 10 }} onPress={ () => {} }/>
    <Waiting />
  </View>
}

export const VaultsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Open)
