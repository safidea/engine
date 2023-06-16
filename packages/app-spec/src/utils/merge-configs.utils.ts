import type { ObjectInterface } from 'shared-common'

export default function mergeConfigs(target: ObjectInterface, source: ObjectInterface) {
  if (typeof source !== 'object' || source === null) {
    return target
  }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        if (typeof target[key] !== 'object' || target[key] === null) {
          target[key] = Array.isArray(source[key]) ? [] : {}
        }
        mergeConfigs(target[key] as ObjectInterface, source[key] as ObjectInterface)
      } else {
        target[key] = source[key]
      }
    }
  }
  return target
}
