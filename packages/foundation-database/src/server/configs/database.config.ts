import { join } from 'path'
import debug from 'debug'
import { ConfigUtils, SchemaUtils, ObjectUtils } from '@common/server'
import { DatabaseUtils, PrismaUtils } from '@database/server'

import type { DatabasesInterface } from '@database'
import type { ConfigInterface } from '@common'

const log = debug('database:config')

class DatabaseConfig implements ConfigInterface {
  public enrich() {
    const databases = this.get()
    if (!databases || typeof databases !== 'object' || ObjectUtils.isEmpty(databases)) {
      log('set default databases')
      ConfigUtils.set('databases', DatabaseUtils.getDefaults())
    }
  }

  public validate() {
    const databases = this.get()
    for (const database in databases) {
      log(`validate schema ${database}`)
      SchemaUtils.validateFromType(databases[database], {
        path: join(__dirname, '../../shared/interfaces', 'database.interface.ts'),
        type: 'DatabaseInterface',
        name: database,
      })
    }
  }

  public lib() {
    const databases = this.get()
    for (const database in databases) {
      log(`setup prisma database schema ${database}`)
      PrismaUtils.updateDatabaseSchema(database, databases[database])
    }
  }

  public js() {
    const databases = this.get()
    for (const database in databases) {
      log(`build prisma database client ${database}`)
      PrismaUtils.buildClient(database)
    }
    PrismaUtils.buildIndexClients(Object.keys(databases))
  }

  private get(): DatabasesInterface {
    return ConfigUtils.get('databases') as DatabasesInterface
  }
}

export default new DatabaseConfig()
