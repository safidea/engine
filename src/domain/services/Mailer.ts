import type { Sent } from '../entities/email/Sent'
import type { ToSend } from '../entities/email/ToSend'
import type { Logger } from './Logger'

export interface Params {
  host: string
  port: number
  user: string
  pass: string
  secure?: boolean
  logger: Logger
}

export interface Spi {
  params: Params
  send(email: ToSend): Promise<Sent>
}

export class Mailer {
  constructor(private spi: Spi) {}

  send = async (emailToSend: ToSend): Promise<Sent> => {
    const { logger } = this.spi.params
    logger.log(`sending email to: ${emailToSend.data.to}`)
    return this.spi.send(emailToSend)
  }
}
