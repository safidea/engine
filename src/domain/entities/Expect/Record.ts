import { type BaseExpect } from './base'
import type { Filter } from '@domain/entities/Filter'
import { TestError } from '@domain/entities/Error/Test'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { App } from '../App'

export interface RecordExpectConfig {
  table: string
}

export interface RecordExpectEntities {
  find: Filter
}

export class RecordExpect implements BaseExpect {
  constructor(
    private _config: RecordExpectConfig,
    private _entities: RecordExpectEntities
  ) {}

  execute = async (app: App, _page: BrowserPage, _context?: object) => {
    const { table } = this._config
    const { find } = this._entities
    const tableRow = await app.getTable(table).db.read(find)
    if (!tableRow) {
      throw new TestError({
        code: 'RECORD_NOT_FOUND',
        expected: JSON.stringify(find),
        received: undefined,
      })
    }
  }
}
