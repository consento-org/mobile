export function createError <Any> (message: string, props: Any): Error {
  return Object.assign(new Error(message), props)
}
