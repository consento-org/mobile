import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({})

function Open ({}) {
  return <View style={{ justifyContent: 'center', flex: 1 }}>
    <Text>{"Relations"}</Text>
  </View>
}

export const RelationsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Open)
