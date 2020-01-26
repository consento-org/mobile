import 'expo/build/Expo.fx'
import registerRootComponent from 'expo/build/launch/registerRootComponent'
import { activateKeepAwake } from 'expo-keep-awake'

import { Screenshot } from '../App'

// eslint-disable-next-line no-undef
if (__DEV__) {
  activateKeepAwake()
}

registerRootComponent(Screenshot('$$serverUrl'))
