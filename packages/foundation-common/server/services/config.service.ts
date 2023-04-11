import fs from 'fs-extra'
import { join } from 'path'
import { StringUtils, ObjectUtils } from '../../shared'
import { ROOT_PATH } from '../settings/path.settings'

import type { Config } from '../../types'

class ConfigService {
  private config: Config

  init(): void {
    const { CONFIG_FILE_PATH } = process.env
    if (!CONFIG_FILE_PATH) throw new Error('CONFIG_FILE_PATH not set')
    const path = join(ROOT_PATH, CONFIG_FILE_PATH as string)
    if (!fs.pathExistsSync(path)) throw new Error(`Config file not found: ${path}`)
    const file = fs.readFileSync(path, 'utf8')
    if (!StringUtils.isJSON(file)) throw new Error(`Error parsing config file`)
    this.config = JSON.parse(file)
  }

  get(path?: string): Config {
    if (!this.config) this.init()
    if (path) return ObjectUtils.getAtPath(this.config, path)
    return this.config
  }

  updateFromCache(cache: Config): void {
    this.config = cache
  }
}

const config = new ConfigService()

export default config
