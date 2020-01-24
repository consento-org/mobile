import { useState } from 'react'
import Timespan from 'readable-timespan'
import useInterval from '@use-it/interval'

const timespan = new Timespan({
  millisecond: false
})

function stringify (timestamp): string {
  return `${timespan.parse(timestamp - Date.now())} left`
}

export function useHumanUntil (timestamp: number): string {
  const [humanTime, setHumanTime] = useState<string>(() => stringify(timestamp))
  useInterval(() => {
    const newTimestamp = stringify(timestamp)
    if (newTimestamp !== humanTime) {
      setHumanTime(newTimestamp)
    }
  }, 250)
  return humanTime
}
