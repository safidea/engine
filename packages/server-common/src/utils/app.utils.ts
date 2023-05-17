import fs from 'fs-extra'
import { join } from 'path'
import PathUtils from '../utils/path.utils'

import type { AppsType, AppsLibrariesType } from '../types/app.type'

class AppUtils {
  private libraries: AppsLibrariesType = {}
  private packages: string[] = []

  public getPackageIndexPathFile(packageName: string): string {
    return join(PathUtils.getPackageAppsFolder(packageName), 'index.ts')
  }

  public getPackagePathFile(packageName: string): string {
    return join(PathUtils.getPackageAppsFolder(packageName), `${this.getName()}.ts`)
  }

  public getName(): string {
    const name = process.env.APP_NAME
    if (!name || typeof name !== 'string') throw new Error('APP_NAME is not set in .env file')
    return name
  }

  public register(Apps: AppsType, packageName: string): void {
    const name = this.getName()
    const libraries = Apps[name]
    if (libraries) this.libraries = { ...this.libraries, ...libraries }
    if (!this.packages.includes(packageName)) this.packages.push(packageName)
  }

  public useLibrary(name: string): unknown | undefined {
    return this.libraries[name]
  }

  public addImport(importLine: string, packageName: string): void {
    const path = this.getPackagePathFile(packageName)
    if (!fs.pathExistsSync(path)) {
      fs.ensureFileSync(path)
      fs.appendFileSync(this.getPackageIndexPathFile(packageName), this.getExportLine() + '\n')
    }
    const data = fs.readFileSync(path, 'utf8')
    if (data.includes(importLine)) return
    fs.appendFileSync(path, importLine + '\n')
  }

  public removeAllImports(): void {
    for (const packageName of this.packages) {
      const path = this.getPackagePathFile(packageName)
      if (fs.pathExistsSync(path)) fs.removeSync(path)
      const data = fs.readFileSync(this.getPackageIndexPathFile(packageName), 'utf8')
      const lines = data.split('\n')
      const updatedLines = lines.filter((line) => line != null && line !== this.getExportLine())
      const updatedContent = updatedLines.join('\n')
      fs.writeFileSync(this.getPackageIndexPathFile(packageName), updatedContent, 'utf8')
    }
    this.packages = []
    this.libraries = {}
  }

  public getExportLine(): string {
    const name = this.getName()
    return `export * as ${name} from './${name}'`
  }
}

export default new AppUtils()
