import type { SendEmailMailerActionConfig } from '@domain/entities/Action/mailer/SendEmail'

export interface ISendEmailMailerAction extends SendEmailMailerActionConfig {
  service: 'Mailer'
  action: 'SendEmail'
}
