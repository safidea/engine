import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { Filter } from '@domain/entities/Filter'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { App } from '../App'

export interface Config {
  mailbox: string
}

export interface Entities {
  find: Filter[]
}

export class Email implements Base {
  constructor(
    private _config: Config,
    private _entities: Entities
  ) {}

  execute = async (app: App, _page: BrowserPage, _context?: object) => {
    const { mailbox } = this._config
    const { find } = this._entities
    const email = await app.mailer?.find(mailbox, find)
    if (!email) {
      const expect = find.reduce((acc, filter) => ({ ...acc, [filter.field]: filter.value }), {})
      throw new TestError({
        code: 'EMAIL_NOT_FOUND',
        expected: JSON.stringify(expect),
        received: undefined,
      })
    }
  }
}
