import fs from 'fs-extra'
import dotenv from 'dotenv'
import PathUtils from '../utils/path.utils'
import { ObjectUtils } from 'shared-common'
import debug from 'debug'

import type { ObjectInterface, ObjectValueInterface } from 'shared-common'
import type { ConfigInterface, ConfigSchemaInterface } from '../interfaces/config.interface'

const log = debug('config:common')

class ConfigUtils {
  private config: ConfigSchemaInterface = {}

  constructor() {
    const config = fs.readJsonSync(PathUtils.getAppConfigCache(), { throws: false })
    if (config) {
      log('Initializing config from cache...')
      this.config = config
      dotenv.config({ path: PathUtils.getAppEnvFile(), override: true })
    }
  }

  public init(): ObjectInterface {
    log('Initializing config...')
    const configPath = PathUtils.getAppConfigFile()
    log(`Load ${configPath} file`)
    if (!fs.pathExistsSync(configPath)) throw new Error(`Config file not found: ${configPath}`)
    this.config = fs.readJsonSync(configPath, { throws: false })
    if (!this.config) throw new Error(`Config file is not a valid JSON: ${configPath}`)
    const envPath = PathUtils.getAppEnvFile()
    log(`Load ${envPath} file`)
    dotenv.config({ path: envPath, override: true })
    this.config = ObjectUtils.replaceVars(this.config, process.env)
    log('Config initialized')
    return this.config
  }

  public cache(): void {
    log('Caching config...')
    const cachePath = PathUtils.getAppConfigCache()
    fs.ensureFileSync(cachePath)
    fs.writeJsonSync(cachePath, this.config, { spaces: 2 })
    log('Config cached')
  }

  public exec(configs: ConfigInterface[]): void {
    this.init()
    log('Executing config...')
    for (const config of configs) if (typeof config.enrich === 'function') config.enrich()
    for (const config of configs) if (typeof config.validate === 'function') config.validate()
    for (const config of configs) if (typeof config.lib === 'function') config.lib()
    for (const config of configs) if (typeof config.js === 'function') config.js()
    log('Config executed')
    this.cache()
  }

  public get(path?: string): ObjectValueInterface | undefined {
    if (path) return ObjectUtils.getAtPath(this.config, path)
    return this.config
  }

  public set(path: string, value: ObjectValueInterface): ObjectInterface {
    this.config = ObjectUtils.setAtPath(this.config, path, value)
    return this.config
  }
}

export default new ConfigUtils()
