import type { ObjectInterface, ObjectValueInterface } from '../interfaces/object.interface'

class ObjectUtils {
  public isSame(obj1: ObjectInterface, obj2: ObjectInterface): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }

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

  public replaceVars(
    obj: ObjectInterface,
    vars: { [key: string]: string | undefined }
  ): ObjectInterface {
    const result: ObjectInterface = {}
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') result[key] = this.replaceVarsInString(value, vars)
      else if (typeof value === 'object' && !Array.isArray(value))
        result[key] = this.replaceVars(value, vars)
      else result[key] = value
    }
    return result
  }

  public replaceVarsInString(str: string, vars: { [key: string]: string | undefined }): string {
    let result = str
    for (const [key, value] of Object.entries(vars)) {
      if (value) result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value)
    }
    return result
  }
}

export default new ObjectUtils()
