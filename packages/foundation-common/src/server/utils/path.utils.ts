import fs from 'fs-extra'
import { join, dirname } from 'path'

class PathUtils {
  private getProjectRoot(): string {
    const parentDir = process.cwd()
    return join(dirname(parentDir), '..')
  }

  public getRoot(): string {
    return join(this.getProjectRoot(), process.env.ROOT_PATH || './')
  }

  public getDataFolder(): string {
    const path = join(this.getRoot(), process.env.DATA_FOLDER_PATH || './data')
    fs.ensureDirSync(path)
    return path
  }

  public getJsFolder(): string {
    const path = join(this.getRoot(), './js')
    fs.ensureDirSync(path)
    return path
  }

  public getConfigsFolder(packageName: string): string {
    return join(this.getProjectRoot(), `packages/foundation-${packageName}/src/server/configs`)
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
