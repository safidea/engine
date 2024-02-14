import Logger from './logger'
import Database from './database'
import { MailerDriver } from '@infrastructure/drivers/MailerDriver'

export default class extends MailerDriver {
  constructor({ url }: Database) {
    const logger = new Logger('mailer')
    logger.log(`creating mailbox...`)
    super({
      host: url,
      port: 0,
      user: '_sqlite',
      pass: '_sqlite',
      logger,
    })
    logger.log(`mailbox created`)
  }

  get config() {
    return {
      host: this.params.host,
      port: this.params.port,
      user: this.params.user,
      pass: this.params.pass,
    }
  }
}
