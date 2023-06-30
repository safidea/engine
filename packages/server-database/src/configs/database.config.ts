import debug from 'debug'

import { SchemaUtils, ConfigUtils, ObjectUtils } from 'server-common'
import { DatabaseSchema } from 'shared-database'

import type { DatabaseInterface } from 'shared-database'
import type { ConfigExecInterface } from 'shared-app'
import type { OrmProviderInterface } from '../interfaces/orm.interface'

const log: debug.IDebugger = debug('config:database')

class DatabaseConfig implements ConfigExecInterface {
  public dependsOn = ['tables']
  private ormProvider: OrmProviderInterface
  private databaseConfig: DatabaseInterface
  private databaseCached: DatabaseInterface

  constructor({
    ormProvider,
    configUtils,
  }: {
    ormProvider: OrmProviderInterface
    configUtils: ConfigUtils
  }) {
    this.ormProvider = ormProvider
    this.databaseConfig = configUtils.get('database') as DatabaseInterface
    this.databaseCached = configUtils.getCompiledConfig('database') as DatabaseInterface
  }
  public isUpdated(props?: { silent?: boolean }) {
    const { silent = false } = props || {}
    const toUpdate = !ObjectUtils.isSame(this.databaseConfig, this.databaseCached)
    if (!silent) {
      if (toUpdate) {
        log(`config updated, start execution`)
      } else {
        log(`config not updated, skip`)
      }
    }
    return toUpdate
  }

  public async validateSchema() {
    const schema = new SchemaUtils(DatabaseSchema)
    log(`validate schema`)
    schema.validate(this.databaseConfig)
  }

  public async setupProviders() {
    log(`update connection schema`)
    this.ormProvider.setConnectionSchema(this.databaseConfig)
  }

  public async buildProviders() {
    log(`build client`)
    await this.ormProvider.generateClient()
    log(`build orm file`)
    await this.ormProvider.buildOrmFile()
    log(`prepare migration`)
    await this.ormProvider.prepareMigration()
    log(`apply migration`)
    await this.ormProvider.applyMigration()
  }
}

export default DatabaseConfig
