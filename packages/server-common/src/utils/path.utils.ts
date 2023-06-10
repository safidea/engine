import { join } from 'path'

class PathUtils {
  private path: string

  constructor({ path }: { path: string }) {
    this.path = path
  }

  public getAppConfigFile(): string {
    return join(this.path, 'config.json')
  }

  public getAppEnvFile(): string {
    return join(this.path, '.env')
  }

  public getAppConfigCache(): string {
    return join(this.path, `cache.config.json`)
  }
}

export default PathUtils
