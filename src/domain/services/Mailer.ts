import type { Filter } from '@domain/entities/Filter'
import { SentEmail } from '../entities/Email/Sent'
import type { CreatedEmail } from '../entities/Email/Created'
import type { Logger } from './Logger'
import { IsTextFilter } from '@domain/entities/Filter/text/Is'

export interface MailerConfig {
  host: string
  port: string
  user: string
  pass: string
  from: string
  secure?: boolean
}

export interface MailerServices {
  logger: Logger
}

export interface IMailerSpi {
  verify: () => Promise<void>
  close: () => Promise<void>
  send: (email: CreatedEmail) => Promise<void>
  find: (filter: Filter) => Promise<SentEmail | undefined>
}

export class Mailer {
  constructor(
    private _spi: IMailerSpi,
    private _services: MailerServices
  ) {}

  verify = async (): Promise<void> => {
    const { logger } = this._services
    logger.debug(`verifying mailer connection...`)
    await this._spi.verify()
    logger.debug(`mailer connection verified`)
  }

  close = async (): Promise<void> => {
    this._services.logger.debug(`closing mailer connection...`)
    await this._spi.close()
  }

  send = async (createdEmail: CreatedEmail): Promise<SentEmail> => {
    this._services.logger.debug(`sending email...`, createdEmail)
    await this._spi.send(createdEmail)
    return new SentEmail(createdEmail.toJson())
  }

  find = async (mailbox: string): Promise<SentEmail | undefined> => {
    this._services.logger.debug(`finding email in mailbox "${mailbox}"...`)
    return this._spi.find(new IsTextFilter('to', mailbox))
  }
}
