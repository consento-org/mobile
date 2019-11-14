import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { styles } from '../styles'
import { EmptyView } from './components/EmptyView'
import { TopNavigation } from './components/TopNavigation'
import { Asset } from '../Asset'
import { Slice9Button } from '../Slice9Button'
import { elementSealVaultActive } from '../styles/component/elementSealVaultActive'
import { elementConsentosEmpty } from '../styles/component/elementConsentosEmpty'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({})

// Asset.buttonBackgroundEnabled().render({ width: '50%', height: '50%' })

function Open ({}) {
  return <View style={ styles.screen }>
    <TopNavigation title="Consentos" />
    <EmptyView prototype={ elementConsentosEmpty } />
  </View>
}

export const ConsentosScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Open)
