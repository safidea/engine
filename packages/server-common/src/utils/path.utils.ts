import { join, dirname } from 'path'

class PathUtils {
  public getAppRoot(path?: string): string {
    if (path) return path
    const parentDir = process.cwd()
    return join(dirname(parentDir), '..', 'app')
  }

  public getAppConfigFile(path?: string): string {
    return join(this.getAppRoot(path), 'config.json')
  }

  public getAppEnvFile(path?: string): string {
    return join(this.getAppRoot(path), '.env')
  }

  public getAppConfigCache(path?: string): string {
    return join(this.getAppRoot(path), `cache.config.json`)
  }
}

export default new PathUtils()
