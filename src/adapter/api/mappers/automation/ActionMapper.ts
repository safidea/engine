import type { Action as ActionConfig } from '@adapter/api/configs/automation/action'
import type { Action } from '@domain/engine/automation/action'
import { CreateRecord } from '@domain/engine/automation/action/CreateRecord'
import { SendEmail } from '@domain/engine/automation/action/SendEmail'
import { ToSend } from '@domain/entities/email/ToSend'
import { ToCreate } from '@domain/entities/record/ToCreate'
import type { Database } from '@domain/services/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Mailer } from '@domain/services/Mailer'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Params {
  database: Database
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  mailer?: Mailer
}

export class ActionMapper {
  static toEntity(config: ActionConfig, params: Params): Action {
    const { idGenerator, database, mailer, templateCompiler } = params
    if (config.action === 'CreateRecord') {
      const recordToCreate = new ToCreate(config.fields, { idGenerator, templateCompiler })
      return new CreateRecord({ ...config, recordToCreate, database })
    } else if (config.action === 'SendEmail') {
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
      if (!mailer) throw new Error(`Mailer config not found`)
      return new SendEmail({ ...config, emailToSend, mailer })
    }
    throw new Error(`Action not found`)
  }

  static toManyEntities(configs: ActionConfig[], params: Params): Action[] {
    return configs.map((config) => this.toEntity(config, params))
  }
}
