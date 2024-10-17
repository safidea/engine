import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { Filter } from '@domain/entities/Filter'
import type { App } from '../App'

export interface Config {
  text: string
  mailbox: string
}

export interface Entities {
  find: Filter[]
}

export class ClickInEmail implements Base {
  constructor(
    private _config: Config,
    private _entities: Entities
  ) {}

  execute = async (app: App, page: BrowserPage) => {
    const { text, mailbox } = this._config
    const { find } = this._entities
    const email = await app.mailer?.find(mailbox, find)
    if (!email) {
      throw new TestError({
        code: 'EMAIL_NOT_FOUND',
        expected: find,
      })
    }
    const path = email.findLink(text)
    if (!path) {
      throw new TestError({
        code: 'LINK_IN_EMAIL_NOT_FOUND',
        expected: text,
      })
    }
    const success = await page.open(path)
    if (!success) {
      throw new TestError({
        code: 'PAGE_NOT_FOUND',
        expected: path,
      })
    }
  }
}
