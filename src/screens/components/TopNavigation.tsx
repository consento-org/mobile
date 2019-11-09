import React from 'react'
import { Text, View, StyleSheet, ViewStyle, TextStyle, ImageStyle, TouchableOpacity } from 'react-native'
import { elementTopNavEmpty } from '../../styles/component/elementTopNavEmpty'
import { elementTopNavItem } from '../../styles/component/elementTopNavItem'
import { withNavigation, TNavigation } from '../navigation'

const topNav = Object.freeze<ViewStyle>({
  backfaceVisibility: 'visible',
  backgroundColor: elementTopNavEmpty.backgroundColor,
  borderBottomColor: elementTopNavEmpty.borderTop.border.fill.color,
  borderBottomWidth: elementTopNavEmpty.borderTop.border.thickness,
  height: elementTopNavEmpty.height,
  display: 'flex',
  flexDirection: 'row'
})

const topNavLogo = Object.freeze<ImageStyle>({
  marginLeft: elementTopNavEmpty.logo.place.left,
  marginTop: elementTopNavEmpty.logo.place.top,
  marginRight: elementTopNavEmpty.title.place.left - elementTopNavEmpty.logo.place.right,
  width: elementTopNavEmpty.logo.place.width,
  height: elementTopNavEmpty.logo.place.height
} as ImageStyle)

const topNavTitle = Object.freeze<TextStyle>({
  ... elementTopNavEmpty.title.style,
  marginTop: elementTopNavEmpty.title.place.top,
  height: elementTopNavEmpty.title.place.height,
  textAlignVertical: 'center',
  flexGrow: 1,
  maxWidth: "100%"
})

const space = Object.freeze<TextStyle>({
  width: elementTopNavEmpty.width - elementTopNavEmpty.title.place.right
})

const backIcon = Object.freeze<ImageStyle>(elementTopNavItem.back.place.style())

class TopNavigationClass extends React.Component<{ title: string, back?: boolean, navigation: TNavigation }, { }> {
  render () {
    return <View style={ topNav }>
      { this.props.back ? <TouchableOpacity onPress={ () => this.props.navigation.goBack() }>{ elementTopNavItem.back.img(backIcon) }</TouchableOpacity> : elementTopNavEmpty.logo.img(topNavLogo) }
      <Text style={ topNavTitle }>{ this.props.title }</Text>
      <View style={ space } />
    </View>
  }
}

export const TopNavigation = withNavigation(TopNavigationClass)