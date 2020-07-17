import 'expo/build/Expo.fx'
import registerRootComponent from 'expo/build/launch/registerRootComponent'
import { activateKeepAwake } from 'expo-keep-awake'
import { setGlobalConfig } from 'mobx-keystone'
import { generateId } from './src/util/generateId'
import App from './App'

setGlobalConfig({
  modelIdGenerator: generateId
})

// eslint-disable-next-line no-undef
if (__DEV__) {
  activateKeepAwake()
}
registerRootComponent(App)
