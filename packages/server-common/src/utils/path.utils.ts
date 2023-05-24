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
    return join(this.getAppRoot(), 'data')
  }

  public getAppLibFolder(): string {
    return join(this.getAppRoot(), 'lib')
  }

  public getAppConfigFile(): string {
    return join(this.getAppRoot(), 'config.json')
  }

  public getAppEnvFile(): string {
    return join(this.getAppRoot(), '.env')
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
