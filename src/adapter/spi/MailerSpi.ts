import type { Params, Spi } from '@domain/services/Mailer'
import type { SentDto, ToSendDto } from './dtos/EmailDto'
import { EmailMapper } from './mappers/EmailMapper'
import type { ToSend } from '@domain/entities/email/ToSend'

export interface Driver {
  params: Params
  send(email: ToSendDto): Promise<SentDto>
}

export class MailerSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  send = async (emailToSend: ToSend) => {
    const emailToSendDto = EmailMapper.toToSendDto(emailToSend)
    const emailSent = await this.driver.send(emailToSendDto)
    return EmailMapper.toSentEntity(emailSent)
  }
}
