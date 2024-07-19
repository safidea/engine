import type { Database } from '@domain/services/Database'
import { BaseWithDatabase, type BaseParams } from './base'
import type { Filter } from '@domain/entities/Filter'
import { TestError } from '@domain/entities/Error/Test'

interface Params extends BaseParams {
  table: string
  find: Filter[]
}

export class Record extends BaseWithDatabase {
  private log: (message: string) => void

  constructor(private params: Params) {
    super()
    const { logger } = params
    this.log = logger.init('expect:record')
  }

  executeWithDatabase = async (database: Database) => {
    const { table, find } = this.params
    this.log(`checking if table "${table}" has a record matching "${JSON.stringify(find)}"`)
    const tableRow = await database.table(table).read(find)
    if (!tableRow) {
      const expect = find.reduce((acc, filter) => ({ ...acc, [filter.field]: filter.value }), {})
      throw new TestError({
        code: 'RECORD_NOT_FOUND',
        expected: JSON.stringify(expect),
        received: undefined,
      })
    }
  }
}
