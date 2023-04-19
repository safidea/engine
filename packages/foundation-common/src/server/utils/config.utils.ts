import fs from 'fs-extra'
import { ObjectUtils, PathSettings } from '@server'
import type { ObjectInterface, ObjectValueType } from '@server'

class ConfigUtils {
  private config: ObjectInterface = {}

  init(): ObjectInterface {
    const path = PathSettings.getConfigFile()
    if (!fs.pathExistsSync(path)) throw new Error(`Config file not found: ${path}`)

    this.config = fs.readJsonSync(path, { throws: false })
    if (!this.config) throw new Error(`Config file is not a valid JSON: ${path}`)

    return this.config
  }

  get(path?: string): ObjectValueType {
    if (ObjectUtils.isEmpty(this.config)) this.init()
    if (path) return ObjectUtils.getAtPath(this.config, path)
    return this.config
  }

  clear(): void {
    this.config = {}
  }
}

const configUtils = new ConfigUtils()
export default configUtils
