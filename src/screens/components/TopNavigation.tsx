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
  height: elementTopNavEmpty.height
})

const topNavLogo = Object.freeze<ImageStyle>({
  left: elementTopNavEmpty.logo.place.left,
  top: elementTopNavEmpty.logo.place.top,
  width: elementTopNavEmpty.logo.place.width,
  height: elementTopNavEmpty.logo.place.height,
  position: 'absolute'
} as ImageStyle)

class TopNavigationClass extends React.Component<{ title: string, back?: boolean, navigation: TNavigation, editDelete?: boolean }, { }> {
  render () {
    return <View style={ topNav }>
      { this.props.back ? elementTopNavItem.renderImage(elementTopNavItem.back, { onPress: () => this.props.navigation.goBack() }) : elementTopNavEmpty.logo.img(topNavLogo) }
      { this.props.editDelete
        ? elementTopNavItem.renderText(elementTopNavItem.title, { horz: 'stretch' }, this.props.title)
        : elementTopNavEmpty.renderText(elementTopNavEmpty.title, { horz: 'stretch' }, this.props.title)
      }
    </View>
  }
}

export const TopNavigation = withNavigation(TopNavigationClass)