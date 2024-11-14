import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { App } from '../App'

export interface Config {
  mailbox: string
}

export class Email implements Base {
  constructor(private _config: Config) {}

  execute = async (app: App, _page: BrowserPage, _context?: object) => {
    const { mailbox } = this._config
    const email = await app.mailer.find(mailbox)
    if (!email) {
      throw new TestError({
        code: 'EMAIL_NOT_FOUND',
        expected: mailbox,
        received: undefined,
      })
    }
  }
}
