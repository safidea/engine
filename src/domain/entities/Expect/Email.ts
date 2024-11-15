import { type BaseExpect } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { App } from '../App'

export interface EmailExpectConfig {
  mailbox: string
}

export class EmailExpect implements BaseExpect {
  constructor(private _config: EmailExpectConfig) {}

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
