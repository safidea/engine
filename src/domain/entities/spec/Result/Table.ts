import type { Database } from '@domain/services/Database'
import { BaseWithDatabase, type BaseParams } from './base'
import { SpecError } from '../SpecError'
import type { Filter } from '@domain/services/Filter'

export interface TableConfig {
  table: string
  find: Filter[]
}

export class Table extends BaseWithDatabase {
  constructor(
    private config: TableConfig,
    private params: BaseParams
  ) {
    super()
  }

  executeWithDatabase = async (database: Database) => {
    const { table, find } = this.config
    const { logger, feature, spec } = this.params
    logger.log(`checking if table "${table}" has a row matching "${JSON.stringify(find)}"`)
    const tableRow = await database.table(table).read(find)
    if (!tableRow) {
      throw new SpecError('ROW_NOT_FOUND', {
        feature,
        spec,
        expected: JSON.stringify(find),
        received: undefined,
      })
    }
  }
}
