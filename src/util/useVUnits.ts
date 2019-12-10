import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

export enum TOrientation {
  horizontal = 'horizontal',
  vertical = 'vertical'
}

export interface IVUnits {
  vw (number: number): number
  vh (number: number): number
  vmin (number: number): number
  vmax (number: number): number
  orientation: TOrientation
  isHorz: boolean
  isVert: boolean
}

const listeners = new Set<(lastUpdate: number) => any>()
const mem = {
  vw: 0,
  vh: 0
}

let vUnits: IVUnits
let globalLastUpdate: number

function updateVUnits () {
  const { width, height } = Dimensions.get('window')
  const vw = width / 100
  const vh = height / 100
  if (vw === mem.vw && vh === mem.vh) {
    return
  }
  mem.vw = vw
  mem.vh = vh
  const orientation = vw > vh ? Orientation.horizontal : Orientation.vertical
  globalLastUpdate = Date.now()
  vUnits = Object.freeze({
    vw: (number: number = 1) => vw * number,
    vh: (number: number = 1) => vh * number,
    vmin: (number: number = 1) => Math.min(vw * number, vh * number),
    vmax: (number: number = 1) => Math.max(vw * number, vh * number),
    orientation: orientation,
    isHorz: orientation === Orientation.horizontal,
    isVert: orientation === Orientation.vertical
  })
  const iter = listeners.values()
  do {
    let update = iter.next()
    if (update.done) {
      return
    }
    update.value(globalLastUpdate)
  } while (true)
}

updateVUnits()

export function useVUnits () {
  const setLastUpdate = useState<number>(globalLastUpdate)[1]
  useEffect(() => {
    listeners.add(setLastUpdate)
    if (listeners.size === 1) {
      Dimensions.addEventListener('change', updateVUnits)
    }
    return () => {
      listeners.delete(setLastUpdate)
      if (listeners.size === 0) {
        Dimensions.removeEventListener('change', updateVUnits)
      }
    }
  }, [false]) // Only update the effect once
  return vUnits
}
