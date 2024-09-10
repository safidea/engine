import type { Config } from '@domain/entities/Action/mailer/SendEmail'

export interface SendEmail extends Config {
  service: 'Mailer'
  action: 'SendEmail'
}
