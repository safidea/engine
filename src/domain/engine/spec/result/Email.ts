import { BaseWithMailer, type BaseParams } from './base'
import { TestError } from '@domain/entities/error/Test'
import type { Filter } from '@domain/entities/filter'
import type { Mailer } from '@domain/services/Mailer'

interface Params extends BaseParams {
  mailbox: string
  find: Filter[]
}

export class Email extends BaseWithMailer {
  constructor(private params: Params) {
    super(params.mailbox)
  }

  executeWithMailer = async (mailer: Mailer) => {
    const { mailbox, find, logger, feature, spec } = this.params
    logger.log(`checking if mailbox "${mailbox}" has an email matching "${JSON.stringify(find)}"`)
    const email = await mailer.find(mailbox, find)
    if (!email) {
      const expect = find.reduce((acc, filter) => ({ ...acc, [filter.field]: filter.value }), {})
      throw new TestError({
        code: 'EMAIL_NOT_FOUND',
        feature,
        spec,
        expected: JSON.stringify(expect),
        received: undefined,
      })
    }
  }
}
