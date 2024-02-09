import type { Driver } from '@adapter/spi/MailerSpi'
import type { ToSendDto } from '@adapter/spi/dtos/EmailDto'
import type { Params } from '@domain/services/Mailer'
import nodemailer from 'nodemailer'

export class MailerDriver implements Driver {
  private transporter: nodemailer.Transporter

  constructor(public params: Params) {
    const { host, port, user, pass, secure } = params
    this.transporter = nodemailer.createTransport({
      host,
      port,
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

  send = async (toSendDto: ToSendDto) => {
    const info = await this.transporter.sendMail(toSendDto)
    return {
      id: info.messageId,
      ...toSendDto,
    }
  }
}
