import React from 'react'
import { connect } from 'react-redux'
import { View, ViewStyle, ScrollView } from 'react-native'
import { VaultCard } from './components/VaultCard'
import { styles } from '../styles'
import { TopNavigation } from './components/TopNavigation'
import { Asset } from '../Asset'
import { Waiting } from './components/Waiting'

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

const list = [
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
]

const AddButton = Asset.buttonAddHexagonal().component

function Open ({}) {
  return <View style={ styles.screen }>
    <TopNavigation title="Vaults"/>
    <ScrollView centerContent={ true }>
      <View style={ listStyle }>
      {
        list.map((item, index) =>
          <VaultCard key={ item.key } item={ item } state={
            index % 3 === 0 ? 'open' :
            index % 3 === 1 ? 'pending' : 'locked' }/>
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
