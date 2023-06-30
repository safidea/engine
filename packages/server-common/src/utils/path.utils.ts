import { join } from 'path'
import fs from 'fs-extra'

const { FOUNDATION_APP_PATH = 'app' } = process.env

class PathUtils {
  private cwd: string

  constructor() {
    this.cwd = process.cwd()
  }

  public getAppPath(): string {
    const path = join(this.cwd, FOUNDATION_APP_PATH)
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
