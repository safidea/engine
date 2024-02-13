import { Automation } from '@domain/engine/automation/Automation'
import { Services } from '@domain/services'
import type { Automation as AutomationConfig } from '../../configs/automation/Automation'
import type { Mapper } from '../Mapper'
import type { Logger } from '@domain/services/Logger'
import { ActionMapper } from './ActionMapper'
import { TriggerMapper } from './TriggerMapper'
import type { Server } from '@domain/services/Server'
import type { Queue } from '@domain/services/Queue'
import type { Mailer } from '@domain/services/Mailer'
import type { Database } from '@domain/services/Database'
import type { Database as DatabaseConfig } from '../../configs/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface Params {
  newLogger: (location: string) => Logger
  server: Server
  queue: Queue
  mailer: Mailer
  database: Database
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
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
        database: config.database?.database ?? 'sqlite',
      }
      const server = services.server({
        logger: newLogger(`server`),
      })
      const queue = services.queue({
        logger: newLogger(`queue`),
        ...databaseConfig,
      })
      if (
        !config.mailer?.host ||
        !config.mailer?.port ||
        !config.mailer?.user ||
        !config.mailer?.pass
      ) {
        throw new Error(`mailer config not found`)
      }
      const mailer = services.mailer({
        logger: newLogger(`mailer`),
        host: config.mailer.host,
        port: config.mailer.port,
        user: config.mailer.user,
        pass: config.mailer.pass,
      })
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
