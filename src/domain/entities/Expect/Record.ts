import { type Base, type BaseServices } from './base'
import type { Filter } from '@domain/entities/Filter'
import { TestError } from '@domain/entities/Error/Test'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { App } from '../App'

export interface Config {
  table: string
}

export type Services = BaseServices

export interface Entities {
  find: Filter[]
}

export class Record implements Base {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  execute = async (app: App, _page: BrowserPage) => {
    const { table } = this._config
    const { find } = this._entities
    const { logger } = this._services
    logger.debug(`checking if table "${table}" has a record matching "${JSON.stringify(find)}"`)
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
