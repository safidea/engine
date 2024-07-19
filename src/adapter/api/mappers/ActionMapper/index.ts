import type { Action as Config } from '@adapter/api/configs/Action'
import type { Action } from '@domain/entities/Action'
import { SendEmailMapper } from './SendEmailMapper'
import { CreateRecordMapper } from './CreateRecordMapper'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Mailer } from '@domain/services/Mailer'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Database } from '@domain/services/Database'

interface Services {
  database: Database
  mailer: Mailer
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
}

export class ActionMapper {
  static toEntity(config: Config, services: Services): Action {
    const { action } = config
    const { idGenerator, database, mailer, templateCompiler } = services
    if (action === 'CreateRecord')
      return CreateRecordMapper.toEntity(config, { database, idGenerator, templateCompiler })

    if (action === 'SendEmail')
      return SendEmailMapper.toEntity(config, { mailer, templateCompiler })
    throw new Error(`ActionMapper: Action ${action} not supported`)
  }

  static toManyEntities(configs: Config[], services: Services): Action[] {
    return configs.map((config) => this.toEntity(config, services))
  }
}
