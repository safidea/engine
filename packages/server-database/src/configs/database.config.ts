import debug from 'debug'

import { SchemaUtils, ConfigUtils } from 'server-common'
import { DatabaseSchema } from 'shared-database'

import type { DatabaseInterface } from 'shared-database'
import type { ConfigExecInterface } from 'server-common'
import type { DatabaseProviderInterface } from '../interfaces/database.interface'

const log: debug.IDebugger = debug('config:database')

class DatabaseConfig implements ConfigExecInterface {
  private databaseProvider: DatabaseProviderInterface
  private databaseConfig: DatabaseInterface

  constructor({
    databaseProvider,
    configUtils,
  }: {
    databaseProvider: DatabaseProviderInterface
    configUtils: ConfigUtils
  }) {
    this.databaseProvider = databaseProvider
    this.databaseConfig = configUtils.get('database') as DatabaseInterface
  }

  public async validateSchema() {
    const schema = new SchemaUtils(DatabaseSchema)
    log(`validate schema`)
    schema.validate(this.databaseConfig)
  }

  public async setupProviders() {
    log(`update connection schema`)
    this.databaseProvider.setConnectionSchema(this.databaseConfig)
  }

  public async testProviders() {
    log(`build client`)
    await this.databaseProvider.generateClient()
    log(`test connect`)
    await this.databaseProvider.testConnection()
    log(`test migrate`)
    await this.databaseProvider.testMigration()
  }
}

export default DatabaseConfig
