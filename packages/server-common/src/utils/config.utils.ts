import fs from 'fs-extra'
import PathUtils from '../utils/path.utils'
import { ObjectUtils } from 'shared-common'
import debug from 'debug'

import type { ObjectInterface, ObjectValueInterface } from 'shared-common'
import type { AppConfig, ConfigsExecInterface } from 'shared-app'

const log = debug('config:common')

interface ConfigUtilsProps {
  pathUtils: PathUtils
  fromCompiled?: boolean
}

class ConfigUtils {
  private pathUtils: PathUtils
  private config?: AppConfig

  constructor({ pathUtils, fromCompiled = false }: ConfigUtilsProps) {
    this.pathUtils = pathUtils
    if (fromCompiled) {
      log('Load compiled config...')
      const compiledConfig = this.getCompiledConfig() as AppConfig
      if (!compiledConfig)
        throw new Error(
          `Compiled config file is not a valid JSON: ${this.pathUtils.getCompiledAppConfig()}`
        )
      this.config = compiledConfig
    } else {
      const configPath = this.pathUtils.getAppConfigFile()
      log(`Load config from file ${configPath}`)
      if (!fs.pathExistsSync(configPath)) throw new Error(`Config file not found: ${configPath}`)
      this.config = fs.readJsonSync(configPath, { throws: false })
      if (!this.config) throw new Error(`Config file is not a valid JSON: ${configPath}`)
      this.config = ObjectUtils.replaceVars(this.config, process.env) as AppConfig
    }
  }

  public getCompiledConfig(path?: string): AppConfig | ObjectValueInterface | undefined {
    const compiledConfigPath = this.pathUtils.getCompiledAppConfig()
    const compiledConfig = fs.readJsonSync(compiledConfigPath, { throws: false })
    if (compiledConfig && path) return ObjectUtils.getAtPath(compiledConfig, path)
    return compiledConfig
  }

  public async exec(configs: ConfigsExecInterface, noCache = false): Promise<void> {
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
            if (configs[dependency].isUpdated({ silent: true })) shouldUpdate = true
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

    if (configsToUpdate.length > 0) {
      log('Save compiled config...')
      const cachePath = this.pathUtils.getCompiledAppConfig()
      fs.ensureFileSync(cachePath)
      fs.writeJsonSync(cachePath, this.config, { spaces: 2 })
      log('Config compiled saved')
      const end = Date.now()
      log(`Config executed in ${Math.round((end - start) / 1000)}s`)
    } else {
      log('No config to update')
    }
  }

  public get(path?: string): AppConfig | ObjectValueInterface | undefined {
    if (path) return ObjectUtils.getAtPath(this.config ?? {}, path)
    return this.config
  }

  public set(path: string, value: ObjectValueInterface): ObjectInterface {
    this.config = ObjectUtils.setAtPath(this.config ?? {}, path, value) as AppConfig
    return this.config
  }
}

export default ConfigUtils
