import type { Database } from '@domain/services/Database'
import { BaseWithDatabase, type BaseParams } from './base'
import { SpecError } from '../SpecError'
import type { Filter } from '@domain/services/Filter'

interface Params extends BaseParams {
  table: string
  find: Filter[]
}

export class Record extends BaseWithDatabase {
  constructor(private params: Params) {
    super()
  }

  executeWithDatabase = async (database: Database) => {
    const { table, find, logger, feature, spec } = this.params
    logger.log(`checking if table "${table}" has a record matching "${JSON.stringify(find)}"`)
    const tableRow = await database.table(table).read(find)
    if (!tableRow) {
      throw new SpecError('RECORD_NOT_FOUND', {
        feature,
        spec,
        expected: JSON.stringify(find),
        received: undefined,
      })
    }
  }
}
