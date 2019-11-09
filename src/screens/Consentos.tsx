import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { styles } from '../styles'
import { TopNavigation } from './components/TopNavigation'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({})

function Open ({}) {
  return <View style={ styles.screen }>
    <TopNavigation title="Consentos" />
  </View>
}

export const ConsentosScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Open)
