import { useState, useEffect } from 'react'
import { AsyncStorage } from 'react-native'
import { exists } from './exists'

export interface IConfig {
  address: string
}

let config: IConfig = null

const triggers = new Set <(time: number) => any>()

function setConfig (newConfig: IConfig): void {
  config = newConfig
  const now = Date.now()
  for (const trigger of triggers) {
    trigger(now)
  }
  AsyncStorage.setItem('@consento/config', JSON.stringify(newConfig)).catch(error => {
    console.log({ storeConfigError: error })
  })
}

AsyncStorage
  .getItem('@consento/config')
  .catch(() => null)
  .then((config) => {
    if (!exists(config)) {
      config = {
        address: 'https://notify.consento.org'
      }
    } else {
      config = JSON.parse(config)
    }
    setConfig(config)
  }).catch(error => {
    console.log({ retreiveConfigError: error })
  })

export function useConfig (): [IConfig, (newConfig: IConfig) => void] {
  const trigger = useState(Date.now())[1]
  useEffect(() => {
    triggers.add(trigger)
    return () => triggers.delete(trigger)
  }, [])
  return [config, setConfig]
}
