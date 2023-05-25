import { join, dirname } from 'path'

class PathUtils {
  private getProjectRoot(): string {
    const parentDir = process.cwd()
    return join(dirname(parentDir), '..')
  }

  public getAppRoot(): string {
    return join(this.getProjectRoot(), process.env.FDT_ROOT_PATH || './app')
  }

  public getAppBuildFolder(packageName: string): string {
    return join(this.getAppRoot(), `build/${packageName}`)
  }

  public getAppConfigFile(): string {
    return join(this.getAppRoot(), 'config.json')
  }

  public getAppEnvFile(): string {
    return join(this.getAppRoot(), '.env')
  }

  public getAppConfigCache(): string {
    return join(this.getAppBuildFolder('server-common'), `config.cache.json`)
  }

  public getPackageAppFile(packageName: string): string {
    return join(this.getProjectRoot(), `packages/${packageName}/src/app.ts`)
  }
}

export default new PathUtils()
