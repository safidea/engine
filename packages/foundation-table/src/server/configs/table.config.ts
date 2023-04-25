import debug from 'debug'
import { join } from 'path'
import { ConfigUtils, SchemaUtils } from '@common/server'
import { TableUtils } from '@table/server'
import { PrismaUtils } from '@database/server'

import type { TablesInterface } from '@table'
import type { ConfigInterface } from '@common'

const log = debug('table:config')

class TableConfig implements ConfigInterface {
  public enrich() {
    const tables = this.get()
    const defaultFields = TableUtils.getDefaultFields()
    for (const table in tables) {
      let { fields } = tables[table]
      if (typeof fields === 'object') {
        fields = { ...fields, ...defaultFields }
      } else {
        fields = defaultFields
      }
    }
    ConfigUtils.set('tables', tables)
  }

  public validate() {
    const tables = this.get()
    for (const table in tables) {
      log(`validate schema ${table}`)
      SchemaUtils.validateFromType(tables[table], {
        path: join(__dirname, '../../shared/interfaces', 'table.interface.ts'),
        type: 'TableInterface',
        name: table,
      })
    }
  }

  public lib() {
    const tables = this.get()
    for (const table in tables) {
      log(`setup prisma model schema ${table}`)
      const { base, model, fields, unique } = tables[table]
      const modelName = model || PrismaUtils.getModelName(table)
      PrismaUtils.updateModelSchema(base, modelName, {
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
