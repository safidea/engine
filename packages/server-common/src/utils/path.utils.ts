import fs from 'fs-extra'
import { join, dirname } from 'path'

class PathUtils {
  private getProjectRoot(): string {
    const parentDir = process.cwd()
    return join(dirname(parentDir), '..')
  }

  public getAppRoot(): string {
    return join(this.getProjectRoot(), process.env.FDT_ROOT_PATH || './')
  }

  public getAppDataFolder(): string {
    const path = join(this.getAppRoot(), './data')
    fs.ensureDirSync(path)
    return path
  }

  public getAppJsFolder(): string {
    const path = join(this.getAppRoot(), './js')
    fs.ensureDirSync(path)
    return path
  }

  public getAppConfigFile(): string {
    const path = join(this.getAppRoot(), './config.json')
    if (!fs.pathExistsSync(path)) throw new Error(`Config file not found: ${path}`)
    return path
  }

  public getAppConfigCache(): string {
    return join(this.getAppDataFolder(), `config.cache.json`)
  }

  public getPackageConfigsFolder(packageName: string): string {
    return join(this.getProjectRoot(), `packages/${packageName}/src/configs`)
  }

  public getPackageAppsFolder(packageName: string): string {
    return join(this.getProjectRoot(), `packages/${packageName}/src/apps`)
  }
}

export default new PathUtils()
