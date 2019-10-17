import { StyleSheet, StatusBar, Platform } from 'react-native'
import { BottomTabBarOptions } from 'react-navigation-tabs/src/types'
import { Colors } from './colors'
import { Fonts } from './fonts'

// https://reactnavigation.org/docs/en/bottom-tab-navigator.html#bottomtabnavigatorconfig
// → "tabBarOptions"
export const tabBarOptions: BottomTabBarOptions = {
  showLabel: true,
  activeBackgroundColor: Colors.consentoBlue,
  inactiveBackgroundColor: Colors.consentoGrey,
  style: {
    backfaceVisibility: 'visible',
    borderTopColor: '#00F',
    borderTopWidth: 5,
    height: 100
  },
  tabStyle: StyleSheet.create({
    tab: {
      padding: 20
    }
  }).tab,
  labelStyle: StyleSheet.create({
    label: {
      color: '#f00',
      fontFamily: Fonts.RobotoBold
    }
  }).label
}

export const styles = StyleSheet.create({
  label: {
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic'
  },
  firstButton: {
    margin: 10
  },
  input: {
    borderBottomColor: '#999',
    paddingBottom: 2,
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    width: 200,
    height: 20
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    // alignContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start'
    // justifyContent: 'center',
  }
})
