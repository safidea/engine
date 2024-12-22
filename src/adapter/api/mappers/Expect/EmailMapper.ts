import { EmailExpect, type EmailExpectConfig } from '@domain/entities/Expect/Email'

export class EmailExpectMapper {
  static toEntity = (config: EmailExpectConfig): EmailExpect => {
    return new EmailExpect(config)
  }
}
