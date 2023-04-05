import fs from 'fs-extra'
import { join } from 'path'
import { StringUtils, ObjectUtils } from '../../shared'
import { ROOT_PATH } from '../settings/path.settings'

class ConfigService {
  private config: unknown

  init(): void {
    const { CONFIG_FILE } = process.env
    if (!CONFIG_FILE) throw new Error('CONFIG_FILE not set')
    const path = join(ROOT_PATH, CONFIG_FILE as string)
    if (!fs.pathExistsSync(path)) throw new Error(`Config file not found: ${path}`)
    const file = fs.readFileSync(path, 'utf8')
    if (!StringUtils.isJSON(file)) throw new Error(`Error parsing config file`)
    this.config = JSON.parse(file)
  }

  get(path?: string): unknown {
    if (!this.config) this.init()
    if (path) return ObjectUtils.getAtPath(this.config, path)
    return this.config
  }
}

const config = new ConfigService()

export default config
