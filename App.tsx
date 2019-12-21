import React, { useState, useEffect } from 'react'
import { Text } from 'react-native'
import { Loading } from './src/screens/Loading'
import { loadFonts } from './src/styles/Font'
import 'react-native-gesture-handler' // Imported to fix gesture error in tab navigation  

export default function App () {
  const [ error, setError ] = useState<Error>()
  const [ loaded, setLoaded ] = useState<{ Screens: () => JSX.Element }>()
  useEffect(() => {
    Promise.all([
      import('./src/screens'),
      loadFonts()
    ])
      .then(([{ Screens }]) => {
        if (Screens === undefined || Screens === null) {
          throw new Error('No Screen returned by ./src/screens')
        }
        setLoaded({ Screens })
      })
      .catch(setError)
  }, [])
  if (error !== undefined) {
    return <Text>{ `Error while initing:\n${this.state.error}` }</Text>
  }
  if (loaded !== undefined) {
    return <loaded.Screens />
  }
  return <Loading/>
}
