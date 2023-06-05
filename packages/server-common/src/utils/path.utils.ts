import { join, dirname } from 'path'

class PathUtils {
  private getProjectRoot(): string {
    const parentDir = process.cwd()
    return join(dirname(parentDir), '..')
  }

  public getAppRoot(): string {
    return join(this.getProjectRoot(), process.env.APP_PATH || './app')
  }

  public getAppConfigFile(): string {
    return join(this.getAppRoot(), 'config.json')
  }

  public getAppEnvFile(): string {
    return join(this.getAppRoot(), '.env')
  }

  public getAppConfigCache(): string {
    return join(this.getAppRoot(), `cache.config.json`)
  }
}

export default new PathUtils()
