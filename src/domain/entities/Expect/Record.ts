import { type Base, type BaseParams } from './base'
import type { Filter } from '@domain/entities/Filter'
import { TestError } from '@domain/entities/Error/Test'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { App } from '../App'

interface Params extends BaseParams {
  table: string
  find: Filter[]
}

export class Record implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('expect:record')
  }

  execute = async (app: App, _page: BrowserPage) => {
    const { table, find } = this._params
    this._log(`checking if table "${table}" has a record matching "${JSON.stringify(find)}"`)
    const tableRow = await app.getTable(table).db.read(find)
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
