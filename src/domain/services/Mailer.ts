import type { Filter } from '@domain/entities/Filter'
import type { Sent } from '../entities/Email/Sent'
import type { ToSend } from '../entities/Email/ToSend'
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
  send: (email: ToSend) => Promise<Sent>
  find: (filters: Filter[]) => Promise<Sent | undefined>
}

export class Mailer {
  private log: (message: string) => void

  constructor(
    private spi: Spi,
    services: Services
  ) {
    this.log = services.logger.init('mailer')
  }

  verify = async (): Promise<void> => {
    this.log(`verifying mailer connection...`)
    await this.spi.verify()
    this.log(`mailer connection verified`)
  }

  close = async (): Promise<void> => {
    this.log(`closing mailer connection...`)
    await this.spi.close()
  }

  send = async (emailToSend: ToSend): Promise<Sent> => {
    this.log(`sending email to: ${emailToSend.data.to}`)
    return this.spi.send(emailToSend)
  }

  find = async (mailbox: string, filters: Filter[] = []): Promise<Sent | undefined> => {
    filters.push(new Is({ field: 'to', value: mailbox }))
    this.log(`finding email in mailbox "${mailbox}" matching: ${JSON.stringify(filters)}`)
    return this.spi.find(filters)
  }
}
