import fs from 'fs-extra'
import dotenv from 'dotenv'
import PathUtils from '../utils/path.utils'
import { ObjectUtils } from 'shared-common'
import debug from 'debug'

import type { ObjectInterface, ObjectValueInterface } from 'shared-common'
import type { ConfigExecInterface } from '../interfaces/config.interface'
import type { ConfigInterface } from 'shared-config'

const log = debug('config:common')

class ConfigUtils {
  private config: ConfigInterface = {}

  constructor() {
    const config = fs.readJsonSync(PathUtils.getAppConfigCache(), { throws: false })
    if (config) {
      log('Load config from cache...')
      this.config = config
      dotenv.config({ path: PathUtils.getAppEnvFile(), override: true })
    }
  }

  public init(path?: string): ObjectInterface {
    log('Initializing config...')
    const configPath = PathUtils.getAppConfigFile(path)
    log(`Load ${configPath} file`)
    if (!fs.pathExistsSync(configPath)) throw new Error(`Config file not found: ${configPath}`)
    this.config = fs.readJsonSync(configPath, { throws: false })
    if (!this.config) throw new Error(`Config file is not a valid JSON: ${configPath}`)
    const envPath = PathUtils.getAppEnvFile(path)
    log(`Load ${envPath} file`)
    dotenv.config({ path: envPath, override: true })
    this.config = ObjectUtils.replaceVars(this.config, process.env)
    log('Config initialized')
    return this.config
  }

  public cache(path?: string): void {
    log('Caching config...')
    const cachePath = PathUtils.getAppConfigCache(path)
    fs.ensureFileSync(cachePath)
    fs.writeJsonSync(cachePath, this.config, { spaces: 2 })
    log('Config cached')
  }

  public async exec(configs: ConfigExecInterface[], path?: string): Promise<void> {
    const start = Date.now()

    this.init(path)
    log('Executing config...')

    // Enrich config
    let promises = []
    for (const config of configs)
      if (typeof config.enrich === 'function') promises.push(config.enrich())
    await Promise.all(promises)

    // Validate config
    promises = []
    for (const config of configs)
      if (typeof config.validate === 'function') promises.push(config.validate())
    await Promise.all(promises)

    // Setup libs
    promises = []
    for (const config of configs) if (typeof config.lib === 'function') promises.push(config.lib())
    await Promise.all(promises)

    // Build js
    promises = []
    for (const config of configs) if (typeof config.js === 'function') promises.push(config.js())
    await Promise.all(promises)

    log('Config executed')
    this.cache(path)

    const end = Date.now()
    log(`Config executed in ${end - start}ms`)
  }

  public get(path?: string): ConfigInterface | ObjectValueInterface | undefined {
    if (path) return ObjectUtils.getAtPath(this.config, path)
    return this.config
  }

  public set(path: string, value: ObjectValueInterface): ObjectInterface {
    this.config = ObjectUtils.setAtPath(this.config, path, value)
    return this.config
  }
}

export default new ConfigUtils()
