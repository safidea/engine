import type { Filter } from '@domain/entities/filter'
import type { Sent } from '../entities/email/Sent'
import type { ToSend } from '../entities/email/ToSend'
import type { Logger } from './Logger'
import { Is } from '@domain/entities/filter/Is'

export interface Config {
  host: string
  port: string
  user: string
  pass: string
  from: string
  secure?: boolean
}

export interface Params extends Config {
  logger: Logger
}

export interface Spi {
  params: Params
  verify: () => Promise<void>
  close: () => Promise<void>
  send: (email: ToSend) => Promise<Sent>
  find: (filters: Filter[]) => Promise<Sent | undefined>
}

export class Mailer {
  constructor(private spi: Spi) {}

  verify = async (): Promise<void> => {
    const { logger } = this.spi.params
    logger.log(`verifying mailer connection...`)
    await this.spi.verify()
    logger.log(`mailer connection verified`)
  }

  close = async (): Promise<void> => {
    const { logger } = this.spi.params
    logger.log(`closing mailer connection...`)
    await this.spi.close()
  }

  send = async (emailToSend: ToSend): Promise<Sent> => {
    const { logger } = this.spi.params
    logger.log(`sending email to: ${emailToSend.data.to}`)
    return this.spi.send(emailToSend)
  }

  find = async (mailbox: string, filters: Filter[] = []): Promise<Sent | undefined> => {
    const { logger } = this.spi.params
    filters.push(new Is({ field: 'to', value: mailbox }))
    logger.log(`finding email in mailbox "${mailbox}" matching: ${JSON.stringify(filters)}`)
    return this.spi.find(filters)
  }
}
