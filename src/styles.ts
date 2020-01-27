import { Platform } from 'react-native'

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

type Shadow = IOSShadow | AndroidShadow

const shadows: { [elevation: number]: Shadow } = {}

export function shadow (elevation: number = 4): Shadow {
  let shadow: Shadow = shadows[elevation]
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
    })) as Shadow
    shadows[elevation] = shadow
  }
  return shadow
}
