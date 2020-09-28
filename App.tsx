import React, { useState } from 'react'
import 'react-native-gesture-handler' // Imported to fix gesture error in tab navigation
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Text, View, StyleSheet } from 'react-native'
import { AppLoading } from 'expo'
import { loadFonts } from './src/styles/design/Font'
import { NavigationContainer, navigationRef } from './src/util/navigate'
import * as ScreenOrientation from 'expo-screen-orientation'

import { createScreenshots, ScreenshotContext } from './src/util/screenshots'
import useConsento from './src/useConsento'
import { Screens } from './src/screens/Screens'
import { ConsentoContext } from './src/model/Consento'

export const Screenshot = (address: string): (() => JSX.Element) => {
  const screenshots = createScreenshots(address)
  return () =>
    <ScreenshotContext.Provider value={screenshots}>
      <App />
    </ScreenshotContext.Provider>
}

async function loadApp (): Promise<void> {
  await Promise.all([
    ScreenOrientation.unlockAsync(),
    loadFonts()
  ])
}

function ErrorScreen ({ error }: { error: Error }): JSX.Element {
  return <Text>{`Error while loading App:\n${String(error)}`}</Text>
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
})

/**
 * This definition runs before the app. It load the actual App and fonts.
 * In case the app has an error on import, the error will be displayed.
 */
export default function App (): JSX.Element {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  let consento
  try {
    consento = useConsento()
  } catch (error) {
    setError(error)
  }
  if (error === undefined && !loaded) {
    return <AppLoading
      startAsync={loadApp}
      onFinish={() => setLoaded(true)}
      onError={setError}
    />
  }
  if (consento === undefined) {
    return <AppLoading />
  }
  return <SafeAreaProvider>
    <ConsentoContext.Provider value={consento}>
      <NavigationContainer ref={navigationRef}>
        <View style={styles.root}>
          <View style={{ flexGrow: 1 }}>
            {
              error !== undefined
                ? <ErrorScreen error={error} />
                : <Screens />
            }
          </View>
        </View>
      </NavigationContainer>
    </ConsentoContext.Provider>
  </SafeAreaProvider>
}
