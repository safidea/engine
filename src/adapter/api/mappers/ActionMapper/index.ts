import type { Action as Config } from '@adapter/api/configs/Action'
import type { Action } from '@domain/entities/Action'
import { SendEmailMapper } from './SendEmailMapper'
import { CreateRecordMapper } from './CreateRecordMapper'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Mailer } from '@domain/services/Mailer'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Table } from '@domain/entities/Table'
import { RunJavascriptCodeMapper } from './RunJavascriptCodeMapper'
import type { CodeCompiler } from '@domain/services/CodeCompiler'
import { CreatePdfMapper } from './CreatePdf'
import type { Browser } from '@domain/services/Browser'

interface Services {
  mailer: Mailer
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  codeCompiler: CodeCompiler
  browser: Browser
}

interface Entities {
  tables: Table[]
}

export class ActionMapper {
  static toEntity(config: Config, services: Services, entities: Entities): Action {
    const { action } = config
    const { idGenerator, mailer, templateCompiler, codeCompiler, browser } = services
    const { tables } = entities
    if (action === 'CreateRecord')
      return CreateRecordMapper.toEntity(config, { idGenerator, templateCompiler }, { tables })
    if (action === 'SendEmail')
      return SendEmailMapper.toEntity(config, { mailer, templateCompiler })
    if (action === 'RunJavascriptCode')
      return RunJavascriptCodeMapper.toEntity(config, { templateCompiler, codeCompiler })
    if (action === 'CreatePdf')
      return CreatePdfMapper.toEntity(config, { browser, templateCompiler })
    throw new Error(`ActionMapper: Action ${action} not supported`)
  }

  static toManyEntities(configs: Config[], services: Services, entities: Entities): Action[] {
    return configs.map((config) => this.toEntity(config, services, entities))
  }
}
