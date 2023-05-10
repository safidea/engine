import fs from 'fs-extra'
import { join } from 'path'
import { PathUtils, StringUtils, ConfigUtils } from '@common/server'
import PrismaUtils from '@database/server/utils/prisma.utils'

import type { DatabasesInterface } from '@database'

class DatabaseUtils {
  public getDefaults(): DatabasesInterface {
    const path = join(PathUtils.getDataFolder() + '/database/master.db')
    fs.ensureFileSync(path)
    return {
      master: {
        url: 'file:' + path,
        provider: 'sqlite',
      },
    }
  }

  public buildImport(): void {
    const { filePath, script, lines, importName, importLine, exportLine } = this.getImportData()
    if (script.includes(importName) && script.includes(exportLine)) return
    if (!script.includes(importName)) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('/** End import */')) {
          lines[i] = importLine + lines[i]
          break
        }
      }
    }
    if (!script.includes(exportLine)) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('/** End export */')) {
          lines[i] = exportLine + lines[i]
          break
        }
      }
    }
    fs.writeFileSync(filePath, lines.join('\n'))
  }

  public cleanImport() {
    const { filePath, script, lines, importName } = this.getImportData()
    if (script.includes(importName)) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(importName)) {
          lines.splice(i, 1)
          break
        }
      }
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(importName)) {
          lines.splice(i, 1)
          break
        }
      }
      fs.writeFileSync(filePath, lines.join('\n'))
    }
  }

  private getImportData() {
    const appName = ConfigUtils.getAppName()
    const filePath = join(PathUtils.getConfigsFolder('database'), 'import.config.ts')
    const script = fs.readFileSync(filePath, 'utf8')
    const lines = script.split('\n')
    const importName = StringUtils.capitalize(appName) + 'PrismaClients'
    const importLine = `import ${importName} from '${PrismaUtils.getClientFolder()}'\n`
    const exportLine = `  exportPrismaClients('${appName}', ${importName})\n`
    return {
      filePath,
      script,
      lines,
      importName,
      importLine,
      exportLine,
    }
  }
}

export default new DatabaseUtils()
