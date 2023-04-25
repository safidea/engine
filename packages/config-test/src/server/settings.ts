import { join } from 'path'
import fs from 'fs-extra'
import dotenv, { DotenvParseOutput } from 'dotenv'

class TestSettings {
  getAppFolderPath(appName: string): string {
    const path = join(__dirname, `../../apps/${appName}`)
    fs.ensureDirSync(path)
    return path
  }

  getEnvVariables(): string[] {
    return ['CONFIG_FILE_PATH', 'DATA_FOLDER_PATH']
  }

  clearEnv(): void {
    this.getEnvVariables().forEach((key) => {
      delete process.env[key]
    })
  }

  loadEnvFile(appName: string): DotenvParseOutput | undefined {
    const envPath = join(this.getAppFolderPath(appName), '.env')
    fs.ensureFileSync(envPath)
    const { parsed } = dotenv.config({ path: envPath, override: true })
    return parsed
  }
}

const testSettings = new TestSettings()
export default testSettings
