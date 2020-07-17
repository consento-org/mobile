import { EventEmitter } from 'events'

export function subscribeEvent (emitter: EventEmitter, event: string, listener: () => void, triggerImmediately: boolean = true): () => void {
  emitter.on(event, listener)
  if (triggerImmediately) {
    listener()
  }
  return () => emitter.off(event, listener)
}
