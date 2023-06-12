import fs from 'fs-extra'
import dotenv from 'dotenv'
import PathUtils from '../utils/path.utils'
import { ObjectUtils } from 'shared-common'
import debug from 'debug'

import type { ObjectInterface, ObjectValueInterface } from 'shared-common'
import type { ConfigInterface, ConfigExecInterface } from 'shared-app'

const log = debug('config:common')

class ConfigUtils {
  private pathUtils: PathUtils
  private config?: ConfigInterface

  constructor({ pathUtils }: { pathUtils: PathUtils }) {
    this.pathUtils = pathUtils
    const config = fs.readJsonSync(pathUtils.getAppConfigCache(), { throws: false })
    if (config) {
      log('Load config from cache...')
      this.config = config
      dotenv.config({ path: pathUtils.getAppEnvFile(), override: true })
    }
  }

  public init(): ObjectInterface {
    log('Initializing config...')
    const configPath = this.pathUtils.getAppConfigFile()
    log(`Load ${configPath} file`)
    if (!fs.pathExistsSync(configPath)) throw new Error(`Config file not found: ${configPath}`)
    this.config = fs.readJsonSync(configPath, { throws: false })
    if (!this.config) throw new Error(`Config file is not a valid JSON: ${configPath}`)
    const envPath = this.pathUtils.getAppEnvFile()
    log(`Load ${envPath} file`)
    dotenv.config({ path: envPath, override: true })
    this.config = ObjectUtils.replaceVars(this.config, process.env) as ConfigInterface
    log('Config initialized')
    return this.config
  }

  public cache(): void {
    log('Caching config...')
    const cachePath = this.pathUtils.getAppConfigCache()
    fs.ensureFileSync(cachePath)
    fs.writeJsonSync(cachePath, this.config, { spaces: 2 })
    log('Config cached')
  }

  public async exec(...configs: ConfigExecInterface[]): Promise<void> {
    log('Executing config...')
    const start = Date.now()

    // Enrich schema
    let promises = []
    for (const config of configs)
      if (typeof config.enrichSchema === 'function') promises.push(config.enrichSchema())
    await Promise.all(promises)

    // Validate schema
    promises = []
    for (const config of configs)
      if (typeof config.validateSchema === 'function') promises.push(config.validateSchema())
    await Promise.all(promises)

    // Setup providers
    promises = []
    for (const config of configs)
      if (typeof config.setupProviders === 'function') promises.push(config.setupProviders())
    await Promise.all(promises)

    // Test providers
    promises = []
    for (const config of configs)
      if (typeof config.testProviders === 'function') promises.push(config.testProviders())
    await Promise.all(promises)

    const end = Date.now()
    log(`Config executed in ${end - start}ms`)
  }

  public get(path?: string): ConfigInterface | ObjectValueInterface | undefined {
    if (path) return ObjectUtils.getAtPath(this.config ?? {}, path)
    return this.config
  }

  public set(path: string, value: ObjectValueInterface): ObjectInterface {
    this.config = ObjectUtils.setAtPath(this.config ?? {}, path, value) as ConfigInterface
    return this.config
  }
}

export default ConfigUtils
