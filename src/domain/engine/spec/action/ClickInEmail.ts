import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPageAndMailer, type BaseParams } from './base'
import { TestError } from '@domain/entities/error/Test'
import type { Mailer } from '@domain/services/Mailer'
import type { Filter } from '@domain/entities/filter'

interface Params extends BaseParams {
  click: string
  mailbox: string
  find: Filter[]
}

export class ClickInEmail extends BaseWithPageAndMailer {
  constructor(private params: Params) {
    super()
  }

  executeWithPageAndMailer = async (page: BrowserPage, mailer: Mailer) => {
    const { click, mailbox, find, logger, feature, spec } = this.params
    logger.log(
      `clicking "${click}" in email matching ${JSON.stringify(find)} in mailbox "${mailbox}"`
    )
    const email = await mailer.find(mailbox, find)
    if (!email) {
      throw new TestError({
        code: 'EMAIL_NOT_FOUND',
        feature,
        spec,
        expected: find,
      })
    }
    const path = email.findLink(click)
    if (!path) {
      throw new TestError({
        code: 'LINK_IN_EMAIL_NOT_FOUND',
        feature,
        spec,
        expected: click,
      })
    }
    const success = await page.open(path)
    if (!success) {
      throw new TestError({
        code: 'PAGE_NOT_FOUND',
        feature,
        spec,
        expected: path,
      })
    }
  }
}
