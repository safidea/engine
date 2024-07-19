import Logger from './logger'
import { MailerDriver } from '@infrastructure/drivers/MailerDriver'
import type { Config } from '@domain/services/Mailer'
import Database from './database'

export default class extends MailerDriver {
  public config: Config

  constructor({ url }: Database) {
    const logger = new Logger()
    const log = logger.init('[test]:mailer')
    log(`creating mailbox...`)
    const config = {
      host: url,
      port: '0',
      user: '_sqlite',
      pass: '_sqlite',
      from: 'noreply@localhost',
    }
    super(config)
    this.config = config
    log(`mailbox created`)
  }
}
