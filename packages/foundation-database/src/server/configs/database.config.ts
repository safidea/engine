import { join } from 'path'
import fs from 'fs-extra'
import debug from 'debug'
import { ConfigUtils, SchemaUtils, ObjectUtils, PathSettings } from '@common/server'
import { PrismaConfig } from '@database/config'

import type { DatabasesInterface } from '@database'
import type { ConfigInterface } from '@common'

const log = debug('database:config')

class DatabaseConfig implements ConfigInterface {
  public enrich(): void {
    const databases = this.getConfig()
    if (!databases || typeof databases !== 'object' || ObjectUtils.isEmpty(databases)) {
      log('set default databases')
      const path = join(PathSettings.getDataFolder() + '/database/master.db')
      fs.ensureFileSync(path)
      ConfigUtils.set('databases', {
        master: {
          url: 'file:' + path,
          provider: 'sqlite',
        },
      })
    }
  }

  public validate(): void {
    const databases = this.getConfig()
    for (const database in databases) {
      log(`validate schema ${database}`)
      SchemaUtils.validateFromType(databases[database], {
        path: join(__dirname, '../../shared/interfaces', 'database.interface.ts'),
        type: 'DatabaseInterface',
        name: database,
      })
    }
  }

  public lib(): void {
    const databases = this.getConfig()
    for (const database in databases) {
      log(`setup prisma database schema ${database}`)
      PrismaConfig.updateDatabaseSchema(database, databases[database])
    }
  }

  public js(): void {
    const databases = this.getConfig()
    for (const database in databases) {
      log(`build prisma database client ${database}`)
      PrismaConfig.buildClient(database)
    }
    PrismaConfig.buildIndexClients(Object.keys(databases))
  }

  private getConfig(): DatabasesInterface {
    return ConfigUtils.get('databases') as DatabasesInterface
  }
}

export default new DatabaseConfig()
