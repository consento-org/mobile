import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { Fonts } from '../fonts'
import { styles } from '../styles'
import { TopNavigation } from './components/TopNavigation'
import { elementRelationsEmpty } from '../styles/component/elementRelationsEmpty'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({})

function Open ({}) {
  return <View style={ styles.screen }>
    <TopNavigation title="Relations"/>
    <EmptyView prototype={ elementRelationsEmpty } />
  </View>
}

export const RelationsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Open)
