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

export function setAtPath(obj: unknown, path: string, value: unknown): unknown {
  const keys = path.split('.')
  let result: unknown = obj
  for (const key of keys) {
    if (key === keys[keys.length - 1]) {
      ;(result as { [key: string]: unknown })[key] = value
    } else {
      result = (result as { [key: string]: unknown })[key]
    }
  }
  return obj
}
