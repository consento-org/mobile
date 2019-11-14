import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { styles } from '../styles'
import { TopNavigation } from './components/TopNavigation'
import { EmptyView } from './components/EmptyView'
import { elementRelationsEmpty } from '../styles/component/elementRelationsEmpty'
import { Asset } from '../Asset'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({})
const AddButton = Asset.buttonAddRound().component

function Open ({}) {
  return <View style={{ ...styles.screen }}>
    <TopNavigation title="Relations"/>
    <EmptyView prototype={ elementRelationsEmpty } />
    <AddButton style={{ position: 'absolute', right: 10, bottom: 10 }}/>
  </View>
}

export const RelationsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Open)
