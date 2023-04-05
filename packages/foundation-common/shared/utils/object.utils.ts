export function getAtPath(obj: unknown, path: string): unknown {
  const keys = path.split('.')
  let result: unknown = obj
  for (const key of keys) {
    result = (result as { [key: string]: unknown })[key]
    if (!result) {
      break
    }
  }
  return result
}
