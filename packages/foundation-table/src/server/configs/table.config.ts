import debug from 'debug'
import { ConfigUtils, SchemaUtils } from '@common/server'
import TableUtils from '@table/server/utils/table.utils'
import PrismaUtils from '@database/server/utils/prisma.utils'
import { TableInterfaceSchema } from '@table'

import type { TablesInterface } from '@table'
import type { ConfigInterface } from '@common'

const log = debug('table:config')

class TableConfig implements ConfigInterface {
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
    const schema = new SchemaUtils(TableInterfaceSchema)
    for (const table in tables) {
      log(`validate schema ${table}`)
      schema.validate(tables[table])
    }
  }

  public lib() {
    const tables = this.get()
    for (const table in tables) {
      log(`setup prisma model schema ${table}`)
      const { database, model, fields, unique } = tables[table]
      const modelName = model || PrismaUtils.getModelName(table)
      PrismaUtils.updateModelSchema(database, modelName, {
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
