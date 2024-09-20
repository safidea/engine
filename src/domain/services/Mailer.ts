import type { Filter } from '@domain/entities/Filter'
import { SentEmail } from '../entities/Email/Sent'
import type { CreatedEmail } from '../entities/Email/Created'
import type { Logger } from './Logger'
import { Is } from '@domain/entities/Filter/Is'

export interface Config {
  host: string
  port: string
  user: string
  pass: string
  from: string
  secure?: boolean
}

export interface Services {
  logger: Logger
}

export interface Spi {
  verify: () => Promise<void>
  close: () => Promise<void>
  send: (email: CreatedEmail) => Promise<void>
  find: (filters: Filter[]) => Promise<SentEmail | undefined>
}

export class Mailer {
  constructor(
    private _spi: Spi,
    private _services: Services
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

  find = async (mailbox: string, filters: Filter[] = []): Promise<SentEmail | undefined> => {
    filters.push(new Is({ field: 'to', value: mailbox }))
    this._services.logger.debug(`finding email in mailbox "${mailbox}"...`, filters)
    return this._spi.find(filters)
  }
}
