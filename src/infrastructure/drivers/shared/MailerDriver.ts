import type { IMailerDriver } from '@adapter/spi/drivers/MailerSpi'
import type { MailerConfig } from '@domain/services/Mailer'
import nodemailer, { type Transporter } from 'nodemailer'
import type { EmailDto } from '@adapter/spi/dtos/EmailDto'

export class MailerDriver implements IMailerDriver {
  private _transporter: Transporter

  constructor(config: MailerConfig) {
    const { host, port, user, pass, secure } = config
    if (user === '_sqlite' && pass === '_sqlite') {
      throw new Error('You have to import the SQLite driver from Node modules')
    } else {
      this._transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      })
    }
  }

  verify = async () => {
    await this._transporter.verify()
  }

  close = async () => {
    await this._transporter.close()
  }

  send = async (toSendDto: EmailDto) => {
    await this._transporter.sendMail(toSendDto)
  }

  find = async (): Promise<EmailDto | undefined> => {
    throw new Error('not implemented')
  }
}
