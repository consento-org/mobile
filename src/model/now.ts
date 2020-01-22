import { observable } from 'mobx'

const NOW = observable.box <number>(Date.now())
const HUMAN_DELAY = 1000 / 25 // 25fps are a good kind of delay for humans to not notice

setInterval(() => NOW.set(Date.now()), HUMAN_DELAY)

export function now (): number {
  return NOW.get()
}
