import fs from 'fs-extra'
import { ObjectUtils, PathUtils } from '@common/server'

import type { ObjectInterface, ObjectValueType } from '@common/server'

class ConfigUtils {
  private config: ObjectInterface

  constructor() {
    this.config = fs.readJsonSync(PathUtils.getConfigCache(), { throws: false }) || {}
  }

  public init(): ObjectInterface {
    const path = PathUtils.getConfigFile()
    this.config = fs.readJsonSync(path, { throws: false })
    if (!this.config) throw new Error(`Config file is not a valid JSON: ${path}`)
    return this.config
  }

  public get(path?: string): ObjectValueType | undefined {
    if (ObjectUtils.isEmpty(this.config)) this.init()
    if (path) return ObjectUtils.getAtPath(this.config, path)
    return this.config
  }

  public set(path: string, value: ObjectValueType): ObjectInterface {
    if (ObjectUtils.isEmpty(this.config)) this.init()
    this.config = ObjectUtils.setAtPath(this.config, path, value)
    return this.config
  }

  public clear(): void {
    this.config = {}
  }

  public cache(): void {
    const cachePath = PathUtils.getConfigCache()
    fs.writeJsonSync(cachePath, this.config, { spaces: 2 })
  }
}

export default new ConfigUtils()
