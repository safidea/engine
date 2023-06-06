import debug from 'debug'
import PrismaUtils from '../utils/prisma.utils'

import { ConfigUtils, SchemaUtils } from 'server-common'
import { DatabaseSchema } from 'shared-database'

import type { DatabaseInterface } from 'shared-database'
import type { ConfigInterface } from 'server-common'

const log: debug.IDebugger = debug('config:database')

class DatabaseConfig implements ConfigInterface {
  public validate() {
    const database = this.get()
    if (!database) return
    const schema = new SchemaUtils(DatabaseSchema)
    log(`validate database schema`)
    schema.validate(database)
  }

  public lib() {
    const database = this.get()
    if (!database) return
    log(`setup prisma schema`)
    PrismaUtils.updateDatabaseSchema(database)
  }

  public async js() {
    const database = this.get()
    if (!database) return
    log(`build prisma client`)
    PrismaUtils.generateClient()
    log(`connect database`)
    await PrismaUtils.connect(log)
    log(`migrate database`)
    PrismaUtils.migrateDatabase()
  }

  private get(): DatabaseInterface {
    return ConfigUtils.get('database') as DatabaseInterface
  }
}

export default new DatabaseConfig()
