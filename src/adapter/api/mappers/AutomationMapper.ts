import { Automation } from '@domain/entities/Automation'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Logger } from '@domain/services/Logger'
import type { Mailer } from '@domain/services/Mailer'
import type { Queue } from '@domain/services/Queue'
import type { Server } from '@domain/services/Server'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Automation as Config } from '../configs/Automation'
import { ActionMapper } from './ActionMapper'
import { TriggerMapper } from './TriggerMapper'
import type { Realtime } from '@domain/services/Realtime'
import type { Table } from '@domain/entities/Table'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import type { CodeCompiler } from '@domain/services/CodeCompiler'
import type { Browser } from '@domain/services/Browser'

export interface Services {
  logger: Logger
  server: Server
  queue: Queue
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  realtime: Realtime
  mailer: Mailer
  schemaValidator: SchemaValidator
  codeCompiler: CodeCompiler
  browser: Browser
}

export interface Entities {
  tables: Table[]
}

export class AutomationMapper {
  static toEntity = (config: Config, services: Services, entities: Entities) => {
    const {
      logger,
      server,
      queue,
      mailer,
      idGenerator,
      templateCompiler,
      realtime,
      schemaValidator,
      codeCompiler,
      browser,
    } = services
    const trigger = TriggerMapper.toEntity(
      { ...config.trigger, automation: config.name },
      {
        server,
        queue,
        realtime,
        schemaValidator,
        templateCompiler,
      }
    )
    const actions = ActionMapper.toManyEntities(
      config.actions,
      {
        mailer,
        idGenerator,
        templateCompiler,
        codeCompiler,
        browser,
      },
      entities
    )
    return new Automation({ ...config, trigger, actions, logger })
  }

  static toManyEntities = (configs: Config[], services: Services, entities: Entities) => {
    return configs.map((config) => this.toEntity(config, services, entities))
  }
}
