import { Automation } from '@domain/engine/automation/Automation'
import { Services } from '@domain/services'
import type { Database } from '@domain/services/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Logger } from '@domain/services/Logger'
import type { Mailer } from '@domain/services/Mailer'
import type { Queue } from '@domain/services/Queue'
import type { Server } from '@domain/services/Server'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Database as DatabaseConfig } from '../../configs/Database'
import type { Automation as AutomationConfig } from '../../configs/automation/Automation'
import type { Mapper } from '../Mapper'
import { ActionMapper } from './ActionMapper'
import { TriggerMapper } from './TriggerMapper'

export interface Params {
  newLogger: (location: string) => Logger
  server: Server
  queue: Queue
  database: Database
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  mailer?: Mailer
}

export const AutomationMapper: Mapper<AutomationConfig, Automation, Params> =
  class AutomationMapper {
    static toEntity = (config: AutomationConfig, params: Params) => {
      const { name } = config
      const { newLogger, server, queue, mailer, database, idGenerator, templateCompiler } = params
      const logger = newLogger(`automation:${config.name}`)
      const trigger = TriggerMapper.toEntity(config.trigger, { server, queue, automation: name })
      const actions = ActionMapper.toManyEntities(config.actions, {
        database,
        mailer,
        idGenerator,
        templateCompiler,
      })
      return new Automation({ name, trigger, actions, logger, queue })
    }

    static toManyEntities = (configs: AutomationConfig[], params: Params) => {
      return configs.map((config) => this.toEntity(config, params))
    }

    static toEntityFromServices = (config: AutomationConfig, services: Services) => {
      const newLogger = (location: string) => services.logger({ location })
      const databaseConfig: DatabaseConfig = {
        url: config.database?.url ?? ':memory:',
        db: config.database?.db ?? 'sqlite',
      }
      const server = services.server({
        logger: newLogger(`server`),
      })
      const queue = services.queue({
        logger: newLogger(`queue`),
        ...databaseConfig,
      })
      let mailer: Mailer | undefined
      if (config.mailer) {
        mailer = services.mailer({
          logger: newLogger(`mailer`),
          ...config.mailer,
        })
      }
      const database = services.database({
        logger: newLogger(`database`),
        ...databaseConfig,
      })
      const idGenerator = services.idGenerator()
      const templateCompiler = services.templateCompiler()
      return this.toEntity(config, {
        newLogger,
        server,
        queue,
        database,
        mailer,
        idGenerator,
        templateCompiler,
      })
    }

    static toManyEntitiesFromServices = (configs: AutomationConfig[], services: Services) => {
      return configs.map((config) => this.toEntityFromServices(config, services))
    }
  }
