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
import type { JavascriptCompiler } from '@domain/services/JavascriptCompiler'
import type { Browser } from '@domain/services/Browser'
import type { FileSystem } from '@domain/services/FileSystem'
import type { Storage } from '@domain/services/Storage'
import type { Bucket } from '@domain/entities/Bucket'
import type { SpreadsheetLoader } from '@domain/services/SpreadsheetLoader'
import type { DocumentLoader } from '@domain/services/DocumentLoader'
import type { Monitor } from '@domain/services/Monitor'

export interface Services {
  logger: Logger
  server: Server
  queue: Queue
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  realtime: Realtime
  mailer: Mailer
  schemaValidator: SchemaValidator
  javascriptCompiler: JavascriptCompiler
  browser: Browser
  fileSystem: FileSystem
  storage: Storage
  spreadsheetLoader: SpreadsheetLoader
  documentLoader: DocumentLoader
  monitor: Monitor
}

export interface Entities {
  tables: Table[]
  buckets: Bucket[]
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
      javascriptCompiler,
      browser,
      fileSystem,
      spreadsheetLoader,
      documentLoader,
      monitor,
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
        browser,
        fileSystem,
        spreadsheetLoader,
        documentLoader,
      },
      entities
    )
    return new Automation(config, { logger, monitor }, { trigger, actions })
  }

  static toManyEntities = (configs: Config[], services: Services, entities: Entities) => {
    return configs.map((config) => this.toEntity(config, services, entities))
  }
}
