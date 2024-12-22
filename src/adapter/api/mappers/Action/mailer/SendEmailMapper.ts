import {
  SendEmailMailerAction,
  type SendEmailMailerActionConfig,
  type SendEmailMailerActionServices,
} from '@domain/entities/Action/mailer/SendEmail'

export type SendEmailMailerActionMapperServices = SendEmailMailerActionServices

export class SendEmailMailerActionMapper {
  static toEntity = (
    config: SendEmailMailerActionConfig,
    services: SendEmailMailerActionMapperServices
  ): SendEmailMailerAction => {
    return new SendEmailMailerAction(config, services)
  }
}
