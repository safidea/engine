import type { ToSend } from '@domain/entities/Email/ToSend'
import type { SentDto, ToSendDto } from '../dtos/EmailDto'
import { Sent } from '@domain/entities/Email/Sent'

export class EmailMapper {
  static toToSendDto = (toSend: ToSend): ToSendDto => {
    return toSend.data
  }

  static toSentEntity = (sent: SentDto): Sent => {
    return new Sent(sent)
  }
}
