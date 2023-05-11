import fs from 'fs-extra'
import { join } from 'path'
import * as Apps from '@common/server/apps'
import PathUtils from './path.utils'

class AppUtils {
  private getIndexPathFile(): string {
    return join(PathUtils.getCommonAppsFolder(), 'index.ts')
  }

  private getPathFile(): string {
    return join(PathUtils.getCommonAppsFolder(), `${this.getName()}.ts`)
  }

  public getName(): string {
    const name = process.env.APP_NAME
    if (!name || typeof name !== 'string') throw new Error('APP_NAME is not set in .env file')
    return name
  }

  public importLib(name: string): unknown {
    const app = Apps[this.getName() as keyof typeof Apps]
    if (!app) throw new Error(`App "${this.getName()}" is not configured`)
    const lib = app[name as keyof typeof app]
    if (!lib) throw new Error(`Lib "${name}" is not configured`)
    return lib
  }

  public addImport(importLine: string): void {
    const path = this.getPathFile()
    if (!fs.pathExistsSync(path)) {
      fs.ensureFileSync(path)
      fs.appendFileSync(this.getIndexPathFile(), this.getExportLine() + '\n')
    }
    const data = fs.readFileSync(path, 'utf8')
    if (data.includes(importLine)) return
    fs.appendFileSync(path, importLine + '\n')
  }

  public removeAllImports(): void {
    const path = this.getPathFile()
    if (fs.pathExistsSync(path)) fs.removeSync(path)
    const data = fs.readFileSync(this.getIndexPathFile(), 'utf8')
    const lines = data.split('\n')
    const updatedLines = lines.filter((line) => line != null && line !== this.getExportLine())
    const updatedContent = updatedLines.join('\n')
    fs.writeFileSync(this.getIndexPathFile(), updatedContent, 'utf8')
  }

  public getExportLine(): string {
    const name = this.getName()
    return `export * as ${name} from './${name}'`
  }
}

export default new AppUtils()
