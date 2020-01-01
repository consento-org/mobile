import { exists } from './exists'

export function useDefault <T> (value: T | null | undefined, defaultValue: T): T {
  if (exists(value)) {
    return value
  }
  return defaultValue
}
