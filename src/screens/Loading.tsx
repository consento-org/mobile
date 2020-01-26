import React, { useState, useEffect, forwardRef, Ref } from 'react'
import { View, ViewStyle, TouchableWithoutFeedback, Alert } from 'react-native'
import { screen01Welcome } from '../styles/component/screen01Welcome'
import { systemRimraf } from '../util/systemRimraf'

const style: ViewStyle = {
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  flex: 1,
  backgroundColor: screen01Welcome.backgroundColor
}

const DELETE_THRESHOLD = 8

export const Loading = forwardRef((_, ref: Ref<View>): JSX.Element => {
  const [count, setCount] = useState<number>(0)
  const [alertShown, setAlertShown] = useState<boolean>(false)
  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) {
        setCount(count - 1)
      }
    }, 200)
    return () => clearInterval(interval)
  })
  if (count > 0) {
    console.log(`${count.toString()}/${DELETE_THRESHOLD.toString()}`)
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
              systemRimraf().catch(rimrafError => console.error({ rimrafError }))
            },
            style: 'destructive'
          },
          {
            text: 'cancel'
          }
        ],
        {
          onDismiss: () => { setAlertShown(false) }
        }
      )
      setAlertShown(true)
      setCount(0)
    } else if (!alertShown) {
      setCount(count + 1)
    }
  }}>
    <View style={style} ref={ref}>
      {screen01Welcome.illustration.asset().img()}
    </View>
  </TouchableWithoutFeedback>
})
