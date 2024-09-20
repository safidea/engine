import { SendEmail, type Config, type Services } from '@domain/entities/Action/mailer/SendEmail'

export type SendEmailServices = Services

export class SendEmailMapper {
  static toEntity = (config: Config, services: Services): SendEmail => {
    return new SendEmail(config, services)
  }
}
