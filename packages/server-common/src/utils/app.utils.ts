import fs from 'fs-extra'
import PathUtils from './path.utils'
import type { AppPackagesType, AppLibrariesType } from '../types/app.type'

class AppUtils {
  private packages: AppPackagesType = {}

  public getName(): string {
    if (!process.env.FDT_APP_NAME) throw new Error('FDT_APP_NAME env variable is not set')
    return process.env.FDT_APP_NAME
  }

  public getVersion(): string {
    return process.env.FDT_APP_VERSION || '0.0.0'
  }

  public registerLibraries(libraries: AppLibrariesType, packageName: string): void {
    this.packages[packageName] = { ...this.packages[packageName], ...libraries }
  }

  public useLibrary(libName: string, packageName: string): unknown | undefined {
    if (!this.packages[packageName]) return undefined
    if (!this.packages[packageName][libName]) return undefined
    return this.packages[packageName][libName]
  }

  public clearImports(packageName: string): void {
    const path = PathUtils.getPackageAppFile(packageName)
    fs.writeFileSync(path, 'export {}\n')
  }

  public addImport(importLine: string, packageName: string): void {
    const path = PathUtils.getPackageAppFile(packageName)
    fs.ensureFileSync(path)
    const data = fs.readFileSync(path, 'utf8')
    if (data.includes(importLine)) return
    fs.appendFileSync(path, importLine + '\n')
  }
}

export default new AppUtils()
