import type { Action as Config } from '@adapter/api/configs/Action'
import type { Action } from '@domain/entities/Action'
import { SendEmailMapper, type SendEmailServices } from './mailer/SendEmailMapper'
import {
  CreateRecordMapper,
  type CreateRecordEntities,
  type CreateRecordServices,
} from './database/CreateRecordMapper'
import { RunJavascriptMapper, type RunJavascriptServices } from './code/RunJavascriptMapper'
import {
  CreateDocxFromTemplateMapper,
  type CreateDocxFromTemplateEntities,
  type CreateDocxFromTemplateServices,
} from './document/CreateDocxFromTemplateMapper'
import {
  CreateXlsxFromTemplateMapper,
  type CreateXlsxFromTemplateServices,
} from './spreadsheet/CreateXlsxFromTemplateMapper'
import { ReadRecordMapper } from './database/ReadRecordMapper'
import {
  CreatePdfFromXlsxMapper,
  type CreatePdfFromXlsxServices,
} from './spreadsheet/CreatePdfFromXlsxMapper'
import { RunTypescriptMapper, type RunTypescriptServices } from './code/RunTypescriptMapper'

export type Services = CreateRecordServices &
  SendEmailServices &
  RunJavascriptServices &
  RunTypescriptServices &
  CreateDocxFromTemplateServices &
  CreateXlsxFromTemplateServices &
  CreatePdfFromXlsxServices

export type Entities = CreateRecordEntities & CreateDocxFromTemplateEntities

export class ActionMapper {
  static toEntity(config: Config, services: Services, entities: Entities): Action {
    const { action } = config
    const {
      idGenerator,
      mailer,
      templateCompiler,
      javascriptCompiler,
      typescriptCompiler,
      browser,
      documentLoader,
      spreadsheetLoader,
      fileSystem,
      logger,
      monitor,
    } = services
    const { tables, buckets } = entities
    if (action === 'CreateRecord')
      return CreateRecordMapper.toEntity(
        config,
        { idGenerator, templateCompiler, logger, monitor },
        { tables }
      )
    if (action === 'ReadRecord')
      return ReadRecordMapper.toEntity(config, { templateCompiler, logger, monitor }, { tables })
    if (action === 'SendEmail')
      return SendEmailMapper.toEntity(config, {
        mailer,
        templateCompiler,
        idGenerator,
        logger,
        monitor,
      })
    if (action === 'RunJavascript')
      return RunJavascriptMapper.toEntity(config, {
        templateCompiler,
        javascriptCompiler,
        logger,
        monitor,
      })
    if (action === 'RunTypescript')
      return RunTypescriptMapper.toEntity(config, {
        templateCompiler,
        typescriptCompiler,
        logger,
        monitor,
      })
    if (action === 'CreateDocxFromTemplate')
      return CreateDocxFromTemplateMapper.toEntity(
        config,
        {
          templateCompiler,
          documentLoader,
          idGenerator,
          fileSystem,
          logger,
          monitor,
        },
        { buckets }
      )
    if (action === 'CreateXlsxFromTemplate')
      return CreateXlsxFromTemplateMapper.toEntity(
        config,
        {
          templateCompiler,
          spreadsheetLoader,
          idGenerator,
          fileSystem,
          logger,
          monitor,
        },
        { buckets }
      )
    if (action === 'CreatePdfFromXlsx')
      return CreatePdfFromXlsxMapper.toEntity(
        config,
        {
          templateCompiler,
          spreadsheetLoader,
          browser,
          idGenerator,
          logger,
          monitor,
        },
        { buckets }
      )
    throw new Error(`ActionMapper: Action ${action} not supported`)
  }

  static toManyEntities(configs: Config[], services: Services, entities: Entities): Action[] {
    return configs.map((config) => this.toEntity(config, services, entities))
  }
}
