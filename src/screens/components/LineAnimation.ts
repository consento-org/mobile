import { IListNode, createCircularList } from '../../util/circularList'

export interface TPoint {
  x: number
  y: number
}

export interface ILinePart {
  length: number
  point (from: number, target: TPoint): void
  target (to: number): string
}

export function distance (start: TPoint, end: TPoint): number {
  const xDistance = Math.abs(start.x - end.x)
  const yDistance = Math.abs(start.y - end.y)
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
}

const P = { x: 0, y: 0 }

export class Line implements ILinePart {
  length: number
  start: TPoint
  normal: TPoint
  
  constructor (start: TPoint, end: TPoint) {
    const length = distance(start, end)
    this.length = length
    this.start = start
    this.normal = {
      x: (end.x - start.x) / length,
      y: (end.y - start.y) / length
    }
  }
  point (from: number, target: TPoint) {
    target.x = this.start.x + this.normal.x * from
    target.y = this.start.y + this.normal.y * from
  }
  target (to: number) {
    this.point(to, P)
    return `L ${P.x} ${P.y}`
  }
}

const TwoMathPi = 2 * Math.PI

export class Arc implements ILinePart {
  length: number
  center: TPoint
  start: number
  end: number
  radius: number

  constructor (center: TPoint, radius: number, start: number, end: number) {
    this.center = center
    this.length = TwoMathPi * radius * (end - start)
    this.start = start
    this.end = end
    this.radius = radius
  }

  point (from: number, target: TPoint) {
    const angle = ((from / this.length) * (this.end - this.start) + this.start)
    target.x = this.center.x + Math.sin(angle * TwoMathPi) * this.radius
    target.y = this.center.y - Math.cos(angle * TwoMathPi) * this.radius
  }

  target (to: number) {
    this.point(to, P)
    return `A ${this.radius} ${this.radius} 0, 0, 1, ${P.x} ${P.y}`
  }
}

export class LineAnimation {
  length: number
  first: IListNode<ILinePart>

  constructor (entries: ILinePart[]) {
    this.length = entries.reduce((length, entry) => length + entry.length, 0)
    this.first = createCircularList(entries)
  }

  render (from: number, to: number): string {
    let offset = from
    let length = to - from
    let entry = this.first
    while (offset > entry.node.length) {
      offset -= entry.node.length
      entry = entry.next
    }
    entry.node.point(offset, P)
    let result = `M ${P.x} ${P.y}`
    let i = 0
    while (length > 0 && i < 40) {
      let partLength: number
      if (offset > 0) {
        const leftOver = entry.node.length - offset
        if (length > leftOver) {
          partLength = entry.node.length
          length -= leftOver
        } else {
          partLength = offset + length
          length = 0
        }
        offset = 0
      } else {
        if (length > entry.node.length) {
          partLength = entry.node.length
          length -= partLength
        } else {
          partLength = length
          length = 0
        }
      }
      result += ` ${entry.node.target(partLength)}`
      entry = entry.next
      i++
    }
    return result
  }
}
