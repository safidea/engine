import fs from 'fs-extra'
import { join } from 'path'
import { PathUtils, StringUtils } from '@common/server'
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
    const filePath = join(__dirname, '../configs/import.config.ts')
    const appName = String(process.env.APP_NAME)
    fs.ensureFileSync(filePath)
    const script = fs.readFileSync(filePath, 'utf8')
    const lines = script.split('\n')
    const importName = StringUtils.capitalize(appName) + 'PrismaClients'
    const importLine = `import ${importName} from '${PrismaUtils.getClientFolder()}'`
    const exportLine = `exportPrismaClients('${appName}', ${importName})`
    if (script.includes(importLine) && script.includes(exportLine)) return
    if (!script.includes(importLine)) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('//End import')) {
          lines[i] = importLine + lines[i]
          break
        }
      }
    }
    if (!script.includes(exportLine)) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('//End export')) {
          lines[i] = exportLine + lines[i]
          break
        }
      }
    }
    fs.writeFileSync(filePath, lines.join('\n'))
  }
}

export default new DatabaseUtils()
