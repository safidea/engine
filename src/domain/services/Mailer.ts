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
  private _log: (message: string) => void

  constructor(
    private _spi: Spi,
    services: Services
  ) {
    this._log = services.logger.init('mailer')
  }

  verify = async (): Promise<void> => {
    this._log(`verifying mailer connection...`)
    await this._spi.verify()
    this._log(`mailer connection verified`)
  }

  close = async (): Promise<void> => {
    this._log(`closing mailer connection...`)
    await this._spi.close()
  }

  send = async (emailToSend: ToSend): Promise<Sent> => {
    this._log(`sending email to: ${emailToSend.data.to}`)
    return this._spi.send(emailToSend)
  }

  find = async (mailbox: string, filters: Filter[] = []): Promise<Sent | undefined> => {
    filters.push(new Is({ field: 'to', value: mailbox }))
    this._log(`finding email in mailbox "${mailbox}" matching: ${JSON.stringify(filters)}`)
    return this._spi.find(filters)
  }
}
