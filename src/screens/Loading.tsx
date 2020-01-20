import React, { useState, useEffect } from 'react'
import { View, ViewStyle, TouchableWithoutFeedback, Alert } from 'react-native'
import { screen01Welcome } from '../styles/component/screen01Welcome'
import { rimraf } from '../util/expoRimraf'

const style: ViewStyle = {
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  flex: 1,
  backgroundColor: screen01Welcome.backgroundColor
}

const DELETE_THRESHOLD = 8

export function Loading (): JSX.Element {
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) {
        setCount(count - 1)
      }
    }, 200)
    return () => clearInterval(interval)
  })
  if (count > 0) {
    console.log(`${count}/${DELETE_THRESHOLD}`)
  }
  return <TouchableWithoutFeedback onPress={() => {
    if (count > DELETE_THRESHOLD) {
      Alert.alert(
        'RESET',
        'You can reset the app here, warning: all data will be lost!',
        [
          {
            text: 'reset',
            onPress: () => {
              rimraf('').catch(rimrafError => console.error({ rimrafError }))
            },
            style: 'destructive'
          },
          { text: 'cancel' }
        ]
      )
    } else {
      setCount(count + 1)
    }
  }}>
    <View style={style}>
      {screen01Welcome.illustration.asset().img()}
    </View>
  </TouchableWithoutFeedback>
}
