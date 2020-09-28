// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { IPlacement } from './types'

export function forSize (w: number, h: number): Placement {
  return new Placement({ w, h })
}

export class Placement implements IPlacement {
  x: number
  y: number
  w: number
  h: number
  r: number
  b: number

  left: number
  top: number
  width: number
  height: number
  right: number
  bottom: number

  centerX: number
  centerY: number

  constructor ({ x, y, w, h, r, b }: IPlacement) {
    this.w = w
    this.h = h
    this.x = x ?? 0
    this.y = y ?? 0
    this.r = r ?? 0
    this.b = b ?? 0

    this.left = this.x
    this.top = this.y
    this.width = w
    this.height = h
    this.right = this.r
    this.bottom = this.b
    this.centerX = this.x + w / 2
    this.centerY = this.y + h / 2
  }

  toJSON (): IPlacement {
    return { x: this.x, y: this.y, w: this.width, h: this.height, r: this.right, b: this.bottom }
  }

  spaceBetween (other: Placement): { x: number, y: number } {
    return {
      x: this.spaceX(other),
      y: this.spaceY(other)
    }
  }

  spaceY (other: Placement): number {
    return this.y - (other.y + other.height)
  }

  spaceX (other: Placement): number {
    return this.x - (other.x + other.width)
  }
}
