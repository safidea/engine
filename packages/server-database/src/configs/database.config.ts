import debug from 'debug'

import { SchemaUtils, ConfigUtils, ObjectUtils } from 'server-common'
import { DatabaseSchema } from 'shared-database'

import type { DatabaseInterface } from 'shared-database'
import type { ConfigExecInterface } from 'shared-app'
import type { DatabaseProviderInterface } from '../interfaces/database.interface'

const log: debug.IDebugger = debug('config:database')

class DatabaseConfig implements ConfigExecInterface {
  private databaseProvider: DatabaseProviderInterface
  private databaseConfig: DatabaseInterface
  private databaseCached: DatabaseInterface

  constructor({
    databaseProvider,
    configUtils,
  }: {
    databaseProvider: DatabaseProviderInterface
    configUtils: ConfigUtils
  }) {
    this.databaseProvider = databaseProvider
    this.databaseConfig = configUtils.get('database') as DatabaseInterface
    this.databaseCached = configUtils.getCached('database') as DatabaseInterface
  }

  public isUpdated() {
    log(`check if config is updated`)
    if (!this.databaseConfig) return false
    return !ObjectUtils.isSame(this.databaseConfig, this.databaseCached)
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
