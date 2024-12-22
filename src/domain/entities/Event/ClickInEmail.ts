import type { BrowserPage } from '@domain/services/BrowserPage'
import { type BaseEvent } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { StartedApp } from '../App/Started'

export interface ClickInEmailEventConfig {
  text: string
  mailbox: string
}

export class ClickInEmailEvent implements BaseEvent {
  constructor(private _config: ClickInEmailEventConfig) {}

  execute = async (app: StartedApp, page: BrowserPage) => {
    const { text, mailbox } = this._config
    const email = await app.mailer.find(mailbox)
    if (!email) {
      throw new TestError({
        code: 'EMAIL_NOT_FOUND',
        expected: mailbox,
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
