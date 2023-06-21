import fs from 'fs-extra'
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
    const config = this.getCached() as ConfigInterface
    if (config) {
      log('Load config from cache...')
      this.config = config
    }
  }

  public getCached(path?: string): ConfigInterface | ObjectValueInterface | undefined {
    const cached = fs.readJsonSync(this.pathUtils.getAppConfigCache(), { throws: false })
    if (cached && path) return ObjectUtils.getAtPath(cached, path)
    return cached
  }

  public init(): ObjectInterface {
    log('Initializing config...')
    const configPath = this.pathUtils.getAppConfigFile()
    log(`Load ${configPath} file`)
    if (!fs.pathExistsSync(configPath)) throw new Error(`Config file not found: ${configPath}`)
    this.config = fs.readJsonSync(configPath, { throws: false })
    if (!this.config) throw new Error(`Config file is not a valid JSON: ${configPath}`)
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

  public async exec(configs: ConfigExecInterface[], cache = true): Promise<boolean> {
    log('Executing config...')
    const start = Date.now()

    // Enrich schema
    let promises = []
    for (const config of configs)
      if (typeof config.enrichSchema === 'function') promises.push(config.enrichSchema())
    await Promise.all(promises)

    // Check if config exists
    promises = []
    for (const config of configs) promises.push(config.exists())
    const exists = await Promise.all(promises)

    // Check if config is updated
    const configsUpdated = []
    const configsCached = []
    for (let i = 0; i < configs.length; i++) {
      const config = configs[i]
      if (!exists[i]) continue
      if (config.isUpdated() || cache === false) configsUpdated.push(config)
      else configsCached.push(config)
    }

    // Validate schema
    promises = []
    for (const config of configsUpdated) promises.push(config.validateSchema())
    await Promise.all(promises)

    // Setup providers
    promises = []
    for (const config of configsUpdated)
      if (typeof config.setupProviders === 'function') promises.push(config.setupProviders())
    await Promise.all(promises)

    // Build providers
    promises = []
    for (const config of configsUpdated)
      if (typeof config.buildProviders === 'function') promises.push(config.buildProviders())
    await Promise.all(promises)

    // Cache providers
    promises = []
    for (const config of configsUpdated)
      if (typeof config.cacheProviders === 'function') promises.push(config.cacheProviders())
    await Promise.all(promises)

    // Load cached config
    promises = []
    for (const config of configsCached)
      if (typeof config.loadCached === 'function') promises.push(config.loadCached())
    await Promise.all(promises)

    const end = Date.now()
    log(`Config executed in ${Math.round((end - start) / 1000)}s`)

    return configsUpdated.length > 0
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
