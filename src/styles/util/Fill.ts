// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { exists } from './lang'
import { IFill, FillData, isSketchError, IStop } from './types'

const reg = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?/ig
const hex = (c: number): string => (c >= 0x10) ? c.toString(16) : `0${c.toString(16)}`

export class RGBA {
  r: number
  g: number
  b: number
  a: number
  constructor (string: string) {
    reg.lastIndex = 0
    const parts = reg.exec(string)
    this.r = exists(parts) ? parseInt(parts[1], 16) : 255
    this.g = exists(parts) ? parseInt(parts[2], 16) : 255
    this.b = exists(parts) ? parseInt(parts[3], 16) : 255
    this.a = exists(parts) && exists(parts[4]) ? parseInt(parts[4], 16) : 255
    this.avg = this.avg.bind(this)
  }

  toString (): string {
    return `#${hex(this.r | 0)}${hex(this.g | 0)}${hex(this.b | 0)}${hex(this.a | 0)}`
  }

  avg (other: RGBA): this {
    this.r = (this.r + other.r) / 2
    this.g = (this.g + other.g) / 2
    this.b = (this.b + other.b) / 2
    this.a = (this.a + other.a) / 2
    return this
  }
}

export const WHITE = '#ffffffff'

export function calcAvgColor (stops: IStop[]): string {
  const first = stops[0]
  if (first === undefined || first === null) {
    return WHITE
  }
  let rgba: RGBA = new RGBA(first.color)
  for (let i = 1; i < stops.length; i++) {
    const stop = stops[i]
    rgba = rgba.avg(new RGBA(stop.color))
  }
  return rgba.toString()
}

export class Fill implements IFill {
  data: FillData
  color: string | undefined
  constructor (data: FillData) {
    this.data = data
    if (exists(this.data) && !isSketchError(this.data)) {
      if (typeof this.data === 'string') {
        this.color = this.data
      } else {
        this.color = calcAvgColor(this.data.gradient.stops)
      }
    }
  }
}
