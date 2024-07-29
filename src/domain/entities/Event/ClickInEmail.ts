import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPageAndMailer, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { Mailer } from '@domain/services/Mailer'
import type { Filter } from '@domain/entities/Filter'

interface Params extends BaseParams {
  text: string
  mailbox: string
  find: Filter[]
}

export class ClickInEmail extends BaseWithPageAndMailer {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    super()
    const { logger } = _params
    this._log = logger.init('event:click-in-email')
  }

  executeWithPageAndMailer = async (page: BrowserPage, mailer: Mailer) => {
    const { text, mailbox, find } = this._params
    this._log(
      `clicking on text "${text}" in email matching ${JSON.stringify(find)} in mailbox "${mailbox}"`
    )
    const email = await mailer.find(mailbox, find)
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
