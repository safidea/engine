import type { ObjectInterface, ObjectValueInterface } from '../interfaces/object.interface'

class ObjectUtils {
  public isEmpty(obj: ObjectInterface): boolean {
    return Object.keys(obj).length === 0
  }

  public getAtPath(obj: ObjectInterface, path: string): ObjectValueInterface | undefined {
    const keys = path.split('.')
    let result: ObjectValueInterface = obj
    for (const key of keys) {
      if (typeof result === 'object' && !Array.isArray(result)) result = result[key]
      else return undefined
    }
    return result
  }

  public setAtPath(
    obj: ObjectInterface,
    path: string,
    value: ObjectValueInterface
  ): ObjectInterface {
    const keys = path.split('.')
    let result: ObjectValueInterface = obj
    for (const key of keys) {
      if (typeof result === 'object' && !Array.isArray(result)) {
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
}

export default new ObjectUtils()
