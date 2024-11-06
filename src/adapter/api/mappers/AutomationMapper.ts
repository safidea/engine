import { Automation } from '@domain/entities/Automation'
import type { Automation as Config } from '../configs/Automation'
import {
  ActionMapper,
  type Services as ActionServices,
  type Entities as ActionEntities,
} from './ActionMapper'
import { TriggerMapper, type Services as TriggerServices } from './TriggerMapper'
import type { Database } from '@domain/services/Database'

export type Services = ActionServices &
  TriggerServices & {
    database: Database
  }

export type Entities = ActionEntities

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
      javascriptCompiler,
      typescriptCompiler,
      browser,
      fileSystem,
      spreadsheetLoader,
      documentLoader,
      monitor,
      database,
    } = services
    const trigger = TriggerMapper.toEntity(
      { ...config.trigger, automation: config.name },
      {
        server,
        queue,
        realtime,
        schemaValidator,
        templateCompiler,
        monitor,
      }
    )
    const actions = ActionMapper.toManyEntities(
      config.actions,
      {
        mailer,
        idGenerator,
        templateCompiler,
        javascriptCompiler,
        typescriptCompiler,
        browser,
        fileSystem,
        spreadsheetLoader,
        documentLoader,
        logger,
        monitor,
      },
      entities
    )
    return new Automation(config, { logger, monitor, idGenerator, database }, { trigger, actions })
  }

  static toManyEntities = (configs: Config[] = [], services: Services, entities: Entities) => {
    return configs.map((config) => this.toEntity(config, services, entities))
  }
}
