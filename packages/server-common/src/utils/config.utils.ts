import fs from 'fs-extra'
import PathUtils from '../utils/path.utils'
import { ObjectUtils } from 'shared-common'

import type { ObjectInterface, ObjectValueInterface } from 'shared-common'
import type { ConfigInterface } from '../interfaces/config.interface'

class ConfigUtils {
  private config: ObjectInterface = {}

  constructor() {
    const config = fs.readJsonSync(PathUtils.getAppConfigCache(), { throws: false })
    if (config) this.config = config
  }

  public init(): ObjectInterface {
    const path = PathUtils.getAppConfigFile()
    this.config = fs.readJsonSync(path, { throws: false })
    if (!this.config) throw new Error(`Config file is not a valid JSON: ${path}`)
    this.config = ObjectUtils.replaceVars(this.config, process.env)
    return this.config
  }

  public get(path?: string): ObjectValueInterface | undefined {
    if (path) return ObjectUtils.getAtPath(this.config, path)
    return this.config
  }

  public set(path: string, value: ObjectValueInterface): ObjectInterface {
    this.config = ObjectUtils.setAtPath(this.config, path, value)
    return this.config
  }

  public cache(): void {
    const cachePath = PathUtils.getAppConfigCache()
    fs.ensureFileSync(cachePath)
    fs.writeJsonSync(cachePath, this.config, { spaces: 2 })
  }

  public exec(configs: ConfigInterface[]): void {
    this.init()
    for (const config of configs) if (typeof config.enrich === 'function') config.enrich()
    for (const config of configs) if (typeof config.validate === 'function') config.validate()
    for (const config of configs) if (typeof config.lib === 'function') config.lib()
    for (const config of configs) if (typeof config.js === 'function') config.js()
    this.cache()
  }
}

export default new ConfigUtils()
