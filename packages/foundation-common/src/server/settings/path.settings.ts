import { join } from 'path'

class PathSettings {
  getRoot(): string {
    return join(__dirname, process.env.NEXT_BUILD != null ? '../../..' : '', '../../../../..')
  }

  getDataFolder(): string {
    return join(this.getRoot(), process.env.DATA_FOLDER_PATH || './data')
  }

  getConfigFile(): string {
    return join(this.getRoot(), process.env.CONFIG_FILE_PATH || './config.json')
  }

  getConfigCache(): string {
    return join(this.getDataFolder(), `config.cache.json`)
  }
}

const pathSettings = new PathSettings()
export default pathSettings
