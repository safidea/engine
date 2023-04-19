import { ObjectInterface, ObjectValueType } from '@shared'

export function getAtPath(obj: ObjectInterface, path: string): ObjectValueType {
  const keys = path.split('.')
  let result: ObjectValueType = obj
  for (const key of keys) {
    if (typeof result === 'object') result = result[key]
    else result = undefined
    if (!result) break
  }
  return result
}

export function setAtPath(
  obj: ObjectInterface,
  path: string,
  value: ObjectValueType
): ObjectInterface {
  const keys = path.split('.')
  let result: ObjectValueType = obj
  for (const key of keys) {
    if (typeof result === 'object') {
      if (key === keys[keys.length - 1]) {
        result[key] = value
      } else {
        if (typeof result[key] !== 'object') result[key] = {}
        result = result[key]
      }
    }
  }
  return obj
}

export function isEmpty(obj: ObjectInterface): boolean {
  return Object.keys(obj).length === 0
}
