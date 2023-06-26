import fs from 'fs-extra'
import PathUtils from '../utils/path.utils'
import { ObjectUtils } from 'shared-common'
import debug from 'debug'

import type { ObjectInterface, ObjectValueInterface } from 'shared-common'
import type { ConfigInterface, ConfigsExecInterface } from 'shared-app'

const log = debug('config:common')

class ConfigUtils {
  private pathUtils: PathUtils
  private config?: ConfigInterface

  constructor({ pathUtils, fromCache = false }: { pathUtils: PathUtils; fromCache?: boolean }) {
    this.pathUtils = pathUtils
    if (fromCache) {
      log('Load config from cache...')
      const configCached = this.getCached() as ConfigInterface
      if (!configCached)
        throw new Error(`Cache file is not a valid JSON: ${this.pathUtils.getAppConfigCache()}`)
      this.config = configCached
    } else {
      const configPath = this.pathUtils.getAppConfigFile()
      log(`Load config from file at path ${configPath}`)
      if (!fs.pathExistsSync(configPath)) throw new Error(`Config file not found: ${configPath}`)
      this.config = fs.readJsonSync(configPath, { throws: false })
      if (!this.config) throw new Error(`Config file is not a valid JSON: ${configPath}`)
      this.config = ObjectUtils.replaceVars(this.config, process.env) as ConfigInterface
    }
    log('Config loaded')
  }

  public getCached(path?: string): ConfigInterface | ObjectValueInterface | undefined {
    const cachePath = this.pathUtils.getAppConfigCache()
    if (!fs.pathExistsSync(cachePath)) throw new Error(`Cache file not found: ${cachePath}`)
    const configCached = fs.readJsonSync(cachePath, { throws: false })
    if (configCached && path) return ObjectUtils.getAtPath(configCached, path)
    return configCached
  }

  public cache(): void {
    log('Caching config...')
    const cachePath = this.pathUtils.getAppConfigCache()
    fs.ensureFileSync(cachePath)
    fs.writeJsonSync(cachePath, this.config, { spaces: 2 })
    log('Config cached')
  }

  public async exec(configs: ConfigsExecInterface, noCache = false): Promise<boolean> {
    log('Executing config...')
    const start = Date.now()

    // Enrich schema
    let promises = []
    for (const config of Object.values(configs))
      if (typeof config.enrichSchema === 'function') promises.push(config.enrichSchema())
    await Promise.all(promises)

    // Check if config is updated
    const configsToUpdate = []
    for (const config in configs) {
      let shouldUpdate = configs[config].isUpdated() || noCache === true
      if (!shouldUpdate) {
        const dependsOn = configs[config].dependsOn
        if (dependsOn && dependsOn.length > 0) {
          for (const dependency of dependsOn) {
            if (configs[dependency].isUpdated()) shouldUpdate = true
          }
        }
      }
      if (shouldUpdate) configsToUpdate.push(configs[config])
    }

    // Validate schema
    promises = []
    for (const config of configsToUpdate) promises.push(config.validateSchema())
    await Promise.all(promises)

    // Setup providers
    promises = []
    for (const config of configsToUpdate)
      if (typeof config.setupProviders === 'function') promises.push(config.setupProviders())
    await Promise.all(promises)

    // Build providers
    promises = []
    for (const config of configsToUpdate)
      if (typeof config.buildProviders === 'function') promises.push(config.buildProviders())
    await Promise.all(promises)

    const end = Date.now()
    log(`Config executed in ${Math.round((end - start) / 1000)}s`)

    return configsToUpdate.length > 0
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
