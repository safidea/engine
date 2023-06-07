import debug from 'debug'
import { ConfigUtils, SchemaUtils } from 'server-common'
import { DatabaseService } from 'server-database'
import TableUtils from '../utils/table.utils'
import { TableSchema } from 'shared-table'

import type { TablesInterface } from 'shared-table'
import type { ConfigExecInterface } from 'server-common'

const log: debug.IDebugger = debug('config:table')

class TableConfig implements ConfigExecInterface {
  public enrich() {
    const tables = this.get()
    const defaultFields = TableUtils.getDefaultFields()
    for (const table in tables) {
      const { fields } = tables[table]
      if (typeof fields === 'object') {
        tables[table].fields = { ...fields, ...defaultFields }
      } else {
        tables[table].fields = defaultFields
      }
    }
    ConfigUtils.set('tables', tables)
  }

  public validate() {
    const tables = this.get()
    const schema = new SchemaUtils(TableSchema)
    for (const table in tables) {
      log(`validate schema ${table}`)
      schema.validate(tables[table])
    }
  }

  public lib() {
    const tables = this.get()
    for (const table in tables) {
      log(`setup prisma model schema ${table}`)
      const { model, fields, unique } = tables[table]
      DatabaseService.addModel(model || table, {
        fields,
        unique,
        map: table,
      })
    }
  }

  private get(): TablesInterface {
    return ConfigUtils.get('tables') as TablesInterface
  }
}

export default new TableConfig()
