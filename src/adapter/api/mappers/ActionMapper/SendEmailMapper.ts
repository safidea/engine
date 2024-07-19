import type { SendEmail as SendEmailConfig } from '@adapter/api/configs/Action/SendEmail'
import { SendEmail } from '@domain/entities/Action/SendEmail'
import { ToSend } from '@domain/entities/Email/ToSend'
import type { Mailer } from '@domain/services/Mailer'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  mailer: Mailer
  templateCompiler: TemplateCompiler
}

export class SendEmailMapper {
  static toEntity = (config: SendEmailConfig, services: Services): SendEmail => {
    const { mailer, templateCompiler } = services
    const emailToSend = new ToSend(
      {
        from: config.from,
        to: config.to,
        subject: config.subject,
        text: config.text,
        html: config.html,
      },
      {
        templateCompiler,
      }
    )
    return new SendEmail({ ...config, emailToSend, mailer })
  }
}
