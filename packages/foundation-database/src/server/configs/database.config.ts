import debug from 'debug'
import DatabaseUtils from '@database/server/utils/database.utils'
import PrismaUtils from '@database/server/utils/prisma.utils'

import { ConfigUtils, SchemaUtils, ObjectUtils } from '@common/server'
import { DatabaseInterfaceSchema } from '@database'

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
    const schema = new SchemaUtils(DatabaseInterfaceSchema)
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
    for (const database in databases) {
      log(`build prisma client for database ${database}`)
      PrismaUtils.buildClient(database)
    }
    PrismaUtils.buildIndexClients(Object.keys(databases))
    DatabaseUtils.buildImport()
  }

  private get(): DatabasesInterface {
    return ConfigUtils.get('databases') as DatabasesInterface
  }
}

export default new DatabaseConfig()
