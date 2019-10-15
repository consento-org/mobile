import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({})

function Open ({}) {
  return <View style={{}}>
    <Text>{"Consentos"}</Text>
  </View>
}

export const ConsentosScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Open)
