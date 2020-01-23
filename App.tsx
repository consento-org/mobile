import React, { useState, useEffect } from 'react'
import 'react-native-gesture-handler' // Imported to fix gesture error in tab navigation
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Text } from 'react-native'
import { Loading } from './src/screens/Loading'
import { loadFonts } from './src/styles/Font'
import { exists } from './src/util/exists'
import { setGlobalConfig } from 'mobx-keystone'
import randomBytes from '@consento/sync-randombytes'
import { Buffer, bufferToString } from '@consento/crypto/util/buffer'

setGlobalConfig({
  modelIdGenerator (): string {
    return bufferToString(randomBytes(Buffer.alloc(16)), 'hex')
  }
})

export default function App (): JSX.Element {
  const [error, setError] = useState<Error>()
  const [loaded, setLoaded] = useState<{ ConsentoApp(): JSX.Element }>()
  useEffect(() => {
    Promise.all([
      import('./src/ConsentoApp'),
      loadFonts()
    ])
      .then(([{ ConsentoApp }]) => {
        if (!exists(ConsentoApp)) {
          setLoaded({ ConsentoApp: (): JSX.Element => <Text>'No Screen returned by ./src/ConsentoApp.tsx'</Text> })
        }
        setLoaded({ ConsentoApp })
      })
      .catch(setError)
  }, [])
  if (error !== undefined) {
    return <Text>{`Error while initing:\n${String(this.state.error)}`}</Text>
  }
  if (loaded !== undefined) {
    try {
      return <SafeAreaProvider><loaded.ConsentoApp /></SafeAreaProvider>
    // eslint-disable-next-line no-unreachable
    } catch (err) {
      return <Text>{`Error: ${String(err)}`}</Text>
    }
  }
  return <SafeAreaProvider><Loading /></SafeAreaProvider>
}
