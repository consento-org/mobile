import { LineAnimation, Line, Arc } from './LineAnimation'

export type TLineMode = 'center' | 'inside' | 'outside'

function adjustPath (size: number, mode: TLineMode, thickness: number): number {
  if (mode === 'center') {
    return size
  }
  if (mode === 'outside') {
    return size + thickness
  }
  return size - thickness
}

function adjustBox (size: number, mode: TLineMode, thickness: number): number {
  if (mode === 'center') {
    return size + thickness
  }
  if (mode === 'outside') {
    return size + thickness * 2
  }
  return size
}

export function createBoxOutline (width: number, height: number, radius: number, mode: TLineMode, thickness: number): {
  box: (from: number, to: number) => string
  width: number
  height: number
} {
  const innerWidth = adjustPath(width, mode, thickness)
  const innerHeight = adjustPath(height, mode, thickness)
  const ani = new LineAnimation([
    new Line({ x: radius, y: 0 }, { x: innerWidth - radius, y: 0 }),
    new Arc({ x: innerWidth - radius, y: radius }, radius, 0, 0.25),
    new Line({ x: innerWidth, y: radius }, { x: innerWidth, y: innerHeight - radius }),
    new Arc({ x: innerWidth - radius, y: innerHeight - radius }, radius, 0.25, 0.5),
    new Line({ x: innerWidth - radius, y: innerHeight }, { x: radius, y: innerHeight }),
    new Arc({ x: radius, y: innerHeight - radius }, radius, 0.5, 0.75),
    new Line({ x: 0, y: innerHeight - radius }, { x: 0, y: radius }),
    new Arc({ x: radius, y: radius }, radius, 0.75, 1)
  ])

  const offset = ani.first.node.length / 2
  return {
    box: (from: number, to: number): string => ani.render(offset + from * ani.length, offset + to * ani.length),
    width: adjustBox(width, mode, thickness),
    height: adjustBox(height, mode, thickness)
  }
}
