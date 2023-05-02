import fs from 'fs-extra'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import dotenv, { DotenvParseOutput } from 'dotenv'

class TestUtils {
  public getAppFolderPath(appName: string): string {
    const path = join(__dirname, `../../apps/${appName}`)
    fs.ensureDirSync(path)
    return path
  }

  public getTestAppFolderPath(appIdName: string): string {
    const path = join(__dirname, `../../data/${appIdName}`)
    fs.ensureDirSync(path)
    return path
  }

  public async createTestApp(appName: string): Promise<string> {
    const appIdName = (appName + uuidv4()).replace(/-/g, '_')
    const folderPath = this.getTestAppFolderPath(appIdName)
    const envPath = join(folderPath, '.env')
    await fs.copy(this.getAppFolderPath(appName), folderPath)
    const env = await fs.readFile(envPath, 'utf8')
    await fs.writeFile(envPath, env.replace(`/apps/${appName}`, `/data/${appIdName}`))
    await fs.appendFile(envPath, '\nAPP_NAME=' + appIdName)
    return appIdName
  }

  public async destroyTestApp(appIdName: string): Promise<void> {
    return fs.remove(this.getTestAppFolderPath(appIdName))
  }

  public getEnvVariables(): string[] {
    return ['CONFIG_FILE_PATH', 'DATA_FOLDER_PATH']
  }

  public loadEnvFile(appIdName: string): DotenvParseOutput | undefined {
    const envPath = join(this.getTestAppFolderPath(appIdName), '.env')
    fs.ensureFileSync(envPath)
    const { parsed } = dotenv.config({ path: envPath, override: true })
    return parsed
  }

  public clearEnv(): void {
    this.getEnvVariables().forEach((key) => {
      delete process.env[key]
    })
  }

  public getConfig(appIdName: string): any {
    return fs.readJSONSync(join(this.getTestAppFolderPath(appIdName), 'config.json'))
  }
}

export default new TestUtils()
