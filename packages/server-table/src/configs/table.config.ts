import debug from 'debug'
import { ConfigUtils, SchemaUtils, ObjectUtils } from 'server-common'
import { OrmProviderInterface } from 'server-database'
import { TableFieldsInterface, TableSchema } from 'shared-table'

import type { TablesInterface } from 'shared-table'
import type { ConfigExecInterface } from 'shared-app'
import type { AppProviderInterface } from 'shared-common'

const log: debug.IDebugger = debug('config:table')

class TableConfig implements ConfigExecInterface {
  public dependsOn = ['database']
  private configUtils: ConfigUtils
  private ormProvider: OrmProviderInterface
  private appProvider: AppProviderInterface
  private tablesConfig: TablesInterface
  private tablesCached: TablesInterface

  constructor({
    configUtils,
    ormProvider,
    appProvider,
  }: {
    configUtils: ConfigUtils
    ormProvider: OrmProviderInterface
    appProvider: AppProviderInterface
  }) {
    this.configUtils = configUtils
    this.ormProvider = ormProvider
    this.appProvider = appProvider
    this.tablesConfig = configUtils.get('tables') as TablesInterface
    this.tablesCached = configUtils.getCompiledConfig('tables') as TablesInterface
  }

  public isUpdated() {
    log(`check if config is updated`)
    return !ObjectUtils.isSame(this.tablesConfig, this.tablesCached)
  }

  public async enrichSchema() {
    const tables = this.tablesConfig
    const defaultFields: TableFieldsInterface = {
      id: {
        type: 'String',
        primary: true,
        default: 'cuid()',
      },
      created_at: {
        type: 'DateTime',
        default: 'now()',
      },
      updated_at: {
        type: 'DateTime',
        optional: true,
      },
      deleted_at: {
        type: 'DateTime',
        optional: true,
      },
    }
    for (const table in tables) {
      const { fields } = tables[table]
      if (typeof fields === 'object') {
        tables[table].fields = { ...fields, ...defaultFields }
      } else {
        tables[table].fields = defaultFields
      }
    }
    this.configUtils.set('tables', tables)
  }

  public async validateSchema() {
    const tables = this.tablesConfig
    const schema = new SchemaUtils(TableSchema)
    for (const table in tables) {
      log(`validate schema ${table}`)
      schema.validate(tables[table])
    }
  }

  public async setupProviders() {
    const tables = this.tablesConfig
    for (const table in tables) {
      log(`add database table ${table}`)
      this.ormProvider.addTableSchema(table, tables[table])
    }
  }

  public async buildProviders() {
    log(`build tables routes`)
    this.appProvider.buildRoutes([
      { path: `/table/[table]`, methods: ['GET', 'POST'] },
      { path: `/table/[table]/[id]`, methods: ['GET', 'PATCH', 'PUT', 'DELETE'] },
    ])
  }
}

export default TableConfig
