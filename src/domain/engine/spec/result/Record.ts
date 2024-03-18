import type { Database } from '@domain/services/Database'
import { BaseWithDatabase, type BaseParams } from './base'
import type { Filter } from '@domain/entities/filter'
import { TestError } from '@domain/entities/error/Test'

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
      const expect = find.reduce((acc, filter) => ({ ...acc, [filter.field]: filter.value }), {})
      throw new TestError({
        code: 'RECORD_NOT_FOUND',
        feature,
        spec,
        expected: JSON.stringify(expect),
        received: undefined,
      })
    }
  }
}
