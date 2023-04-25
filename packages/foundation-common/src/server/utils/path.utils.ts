import fs from 'fs-extra'
import { join } from 'path'

class PathUtils {
  public getRoot(): string {
    return join(
      __dirname,
      process.env.NEXT_BUILD != null ? '../../..' : '',
      '../../../../..',
      process.env.ROOT_PATH || './'
    )
  }

  public getDataFolder(): string {
    const path = join(this.getRoot(), process.env.DATA_FOLDER_PATH || './data')
    fs.ensureDirSync(path)
    return path
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
