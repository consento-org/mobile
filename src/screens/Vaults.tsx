import React from 'react'
import { connect } from 'react-redux'
import { View, ViewStyle, ScrollView } from 'react-native'
import { VaultCard } from './components/VaultCard'
import { styles } from '../styles'
import { TopNavigation } from './components/TopNavigation'
import { Asset } from '../Asset'
import { Waiting } from './components/Waiting'
import { IVault } from '../model/Vault'

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

const AddButton = Asset.buttonAddHexagonal().component

export const VaultsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ vaults }: { vaults: IVault[] }) => 
  <View style={ styles.screen }>
    <TopNavigation title="Vaults"/>
    <ScrollView centerContent={ true }>
      <View style={ listStyle }>
      {
        vaults.map(vault => <VaultCard key={ vault.key } vault={ vault } />)
      }
      </View>
    </ScrollView>
    <AddButton style={{ position: 'absolute', right: 10, bottom: 10 }} onPress={ () => {} }/>
  </View>
)
