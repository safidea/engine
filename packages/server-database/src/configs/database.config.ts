import debug from 'debug'
import PrismaUtils from '../utils/prisma.utils'

import { ConfigUtils, SchemaUtils } from 'server-common'
import { DatabaseSchema } from 'shared-database'

import type { DatabasesInterface } from 'shared-database'
import type { ConfigInterface } from 'server-common'

const log: debug.IDebugger = debug('config:database')

class DatabaseConfig implements ConfigInterface {
  public enrich() {
    const databases = this.get()
    for (const database in databases) {
      log(`enrich config ${database}`)
    }
  }

  public validate() {
    const databases = this.get()
    const schema = new SchemaUtils(DatabaseSchema)
    for (const database in databases) {
      log(`validate schema ${database}`)
      schema.validate(databases[database])
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
    if (!databases) return
    for (const database in databases) {
      log(`build prisma client for database ${database}`)
      PrismaUtils.buildClient(database)
    }
    PrismaUtils.importClients(Object.keys(databases))
  }

  private get(): DatabasesInterface {
    return ConfigUtils.get('databases') as DatabasesInterface
  }
}

export default new DatabaseConfig()
