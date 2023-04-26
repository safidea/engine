import fs from 'fs-extra'
import { join } from 'path'

class PathUtils {
  private getProjectRoot(): string {
    switch (String(process.env.NODE_ENV)) {
      case 'production':
        return join(__dirname, '../../../../..')
      case 'development':
        return join(__dirname, '../../../../../../../..')
      case 'config':
        return join(__dirname, '../../../../../../..')
      case 'test':
        return join(__dirname, '../../../../..')
      default:
        throw new Error(`NODE_ENV not set: ${process.env.NODE_ENV}`)
    }
  }

  public getRoot(): string {
    return join(this.getProjectRoot(), process.env.ROOT_PATH || './')
  }

  public getDataFolder(): string {
    const path = join(this.getRoot(), process.env.DATA_FOLDER_PATH || './data')
    fs.ensureDirSync(path)
    return path
  }

  public getJsFolder(packageName: string): string {
    const path = join(this.getProjectRoot(), `packages/foundation-${packageName}/js`)
    fs.ensureDirSync(path)
    return path
  }

  public getConfigFile(): string {
    const path = join(this.getRoot(), process.env.CONFIG_FILE_PATH || './config.json')
    if (!fs.pathExistsSync(path)) throw new Error(`Config file not found: ${path}`)
    return path
  }

  public getConfigCache(): string {
    const path = join(this.getDataFolder(), `config.cache.json`)
    fs.ensureFileSync(path)
    return path
  }
}

export default new PathUtils()
