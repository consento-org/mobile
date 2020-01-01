import { LineAnimation, Line, Arc } from './LineAnimation'

export function createBoxOutline (width: number, height: number, radius: number): (from: number, to: number) => string {
  const ani = new LineAnimation([
    new Line({ x: radius, y: 0 }, { x: width - radius, y: 0 }),
    new Arc({ x: width - radius, y: radius }, radius, 0, 0.25),
    new Line({ x: width, y: radius }, { x: width, y: height - radius }),
    new Arc({ x: width - radius, y: height - radius }, radius, 0.25, 0.5),
    new Line({ x: width - radius, y: height }, { x: radius, y: height }),
    new Arc({ x: radius, y: height - radius }, radius, 0.5, 0.75),
    new Line({ x: 0, y: height - radius }, { x: 0, y: radius }),
    new Arc({ x: radius, y: radius }, radius, 0.75, 1)
  ])

  const offset = ani.first.node.length / 2
  return function (from: number, to: number) {
    return ani.render(offset + from * ani.length, offset + to * ani.length)
  }
}
