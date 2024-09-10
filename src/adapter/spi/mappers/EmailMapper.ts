import type { CreatedEmail } from '@domain/entities/Email/Created'
import { SentEmail } from '@domain/entities/Email/Sent'
import type { EmailDto } from '../dtos/EmailDto'

export class EmailMapper {
  static toDto = (email: CreatedEmail): EmailDto => {
    return email.toJson()
  }

  static toSentEntity = (sent: EmailDto): SentEmail => {
    return new SentEmail(sent)
  }
}
