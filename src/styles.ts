import { StyleSheet, StatusBar, Platform, ViewStyle } from 'react-native'
import { Color } from './styles/Color'

const shadows: { [elevation: number]: ViewStyle } = {}

interface AndroidShadow {
  elevation: number
}

interface IOSShadow {
  shadowColor: 'string'
  shadowOffset: {
    width: number
    height: number
  }
  shadowOpacity: number
  shadowRadius: number
}

export function shadow (elevation: number = 4): IOSShadow | AndroidShadow {
  let shadow = shadows[elevation]
  if (shadow === undefined) {
    shadow = Object.freeze(Platform.select({
      android: {
        elevation
      },
      default: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0.5 * elevation },
        shadowOpacity: 0.3,
        shadowRadius: 0.8 * elevation
      }
    }))
    shadows[elevation] = shadow
  }
  return shadow
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
  screen: {
    // justifyContent: 'center',
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    backgroundColor: Color.grey
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
    // alignContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start'
    // justifyContent: 'center',
  }
})
