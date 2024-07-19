import { Automation } from '@domain/entities/Automation'
import type { Database } from '@domain/services/Database'
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

export interface Services {
  logger: Logger
  server: Server
  queue: Queue
  database: Database
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  realtime: Realtime
  mailer: Mailer
}

export class AutomationMapper {
  static toEntity = (config: Config, services: Services) => {
    const { logger, server, queue, mailer, database, idGenerator, templateCompiler, realtime } =
      services
    const trigger = TriggerMapper.toEntity(
      { ...config.trigger, automation: config.name },
      {
        server,
        queue,
        realtime,
      }
    )
    const actions = ActionMapper.toManyEntities(config.actions, {
      database,
      mailer,
      idGenerator,
      templateCompiler,
    })
    return new Automation({ ...config, trigger, actions, logger, queue })
  }

  static toManyEntities = (configs: Config[], services: Services) => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
