import { join } from 'path'

class PathUtils {
  private cwd: string

  constructor() {
    this.cwd = process.cwd()
  }

  public getAppConfigFile(): string {
    return join(this.cwd, 'config.json')
  }

  public getAppConfigCache(): string {
    return join(this.cwd, `.foundation/compiled.json`)
  }
}

export default PathUtils
