import { join } from 'path'
import fs from 'fs-extra'

class PathUtils {
  private cwd: string

  constructor() {
    this.cwd = process.cwd()
  }

  public getAppPath(): string {
    const path = join(this.cwd, 'app')
    fs.ensureDirSync(path)
    return path
  }

  public getAppConfigFile(): string {
    return join(this.cwd, 'config.json')
  }

  public getCompiledAppConfig(): string {
    return join(this.getAppPath(), `compiled.config.json`)
  }
}

export default PathUtils
