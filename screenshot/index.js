import 'expo/build/Expo.fx'
import registerRootComponent from 'expo/build/launch/registerRootComponent'
import { activateKeepAwake } from 'expo-keep-awake'

import { Screenshot } from '../App'

// eslint-disable-next-line no-undef
if (__DEV__) {
  activateKeepAwake()
}

registerRootComponent(Screenshot('http://192.168.11.11:5432'))
