import React from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { Fonts } from '../fonts'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({})

function Open ({}) {
  return <View style={{ justifyContent: 'center', flex: 1  }}>
    <Text style={{fontFamily: Fonts.PalanquinDarkBold, fontSize: 72, color: '#000'}}>{"Relations"}</Text>
  </View>
}

export const RelationsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Open)
