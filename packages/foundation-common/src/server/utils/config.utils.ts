import fs from 'fs-extra'
import PathUtils from './path.utils'
import { ObjectUtils } from '@common'

import type { ObjectInterface, ObjectValueType } from '@common/server'

class ConfigUtils {
  private config: ObjectInterface = {}

  constructor() {
    const config = fs.readJsonSync(PathUtils.getConfigCache(), { throws: false })
    if (config) this.config = config
  }

  public init(): ObjectInterface {
    const path = PathUtils.getConfigFile()
    this.config = fs.readJsonSync(path, { throws: false })
    if (!this.config) throw new Error(`Config file is not a valid JSON: ${path}`)
    return this.config
  }

  public get(path?: string): ObjectValueType | undefined {
    if (path) return ObjectUtils.getAtPath(this.config, path)
    return this.config
  }

  public set(path: string, value: ObjectValueType): ObjectInterface {
    this.config = ObjectUtils.setAtPath(this.config, path, value)
    return this.config
  }

  public cache(): void {
    const cachePath = PathUtils.getConfigCache()
    fs.writeJsonSync(cachePath, this.config, { spaces: 2 })
  }
}

export default new ConfigUtils()
