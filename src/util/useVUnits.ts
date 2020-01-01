import { createGlobalEffect } from './createGlobalEffect'
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

const mem = {
  vw: null,
  vh: null
}

export const useVUnits = createGlobalEffect({
  update () {
    const { width, height } = Dimensions.get('window')
    const vw = width / 100
    const vh = height / 100
    if (vw === mem.vw && vh === mem.vh) {
      return
    }
    mem.vw = vw
    mem.vh = vh
    const orientation = vw > vh ? TOrientation.horizontal : TOrientation.vertical
    return Object.freeze({
      vw: (number: number = 1) => vw * number,
      vh: (number: number = 1) => vh * number,
      vmin: (number: number = 1) => Math.min(vw * number, vh * number),
      vmax: (number: number = 1) => Math.max(vw * number, vh * number),
      orientation: orientation,
      isHorz: orientation === TOrientation.horizontal,
      isVert: orientation === TOrientation.vertical
    })
  },
  init: handler => Dimensions.addEventListener('change', handler),
  exit: handler => Dimensions.removeEventListener('change', handler)
})
