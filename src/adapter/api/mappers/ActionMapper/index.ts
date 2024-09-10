import type { Action as Config } from '@adapter/api/configs/Action'
import type { Action } from '@domain/entities/Action'
import { SendEmailMapper } from './mailer/SendEmailMapper'
import { CreateRecordMapper } from './database/CreateRecordMapper'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Mailer } from '@domain/services/Mailer'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Table } from '@domain/entities/Table'
import { RunJavascriptMapper } from './code/RunJavascriptMapper'
import type { JavascriptCompiler } from '@domain/services/JavascriptCompiler'
import type { Browser } from '@domain/services/Browser'
import { CreateDocxFromTemplateMapper } from './document/CreateDocxFromTemplateMapper'
import { CreateXlsxFromTemplateMapper } from './spreadsheet/CreateXlsxFromTemplateMapper'
import type { Bucket } from '@domain/entities/Bucket'
import { ReadRecordMapper } from './database/ReadRecordMapper'
import { CreatePdfFromXlsxMapper } from './spreadsheet/CreatePdfFromXlsxMapper'
import type { SpreadsheetLoader } from '@domain/services/SpreadsheetLoader'
import type { DocumentLoader } from '@domain/services/DocumentLoader'
import type { FileSystem } from '@domain/services/FileSystem'

interface Services {
  mailer: Mailer
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  javascriptCompiler: JavascriptCompiler
  browser: Browser
  spreadsheetLoader: SpreadsheetLoader
  documentLoader: DocumentLoader
  fileSystem: FileSystem
}

interface Entities {
  tables: Table[]
  buckets: Bucket[]
}

export class ActionMapper {
  static toEntity(config: Config, services: Services, entities: Entities): Action {
    const { action, service } = config
    const {
      idGenerator,
      mailer,
      templateCompiler,
      javascriptCompiler,
      browser,
      documentLoader,
      spreadsheetLoader,
      fileSystem,
    } = services
    const { tables, buckets } = entities
    if (service === 'Database') {
      if (action === 'CreateRecord')
        return CreateRecordMapper.toEntity(config, { idGenerator, templateCompiler }, { tables })
      if (action === 'ReadRecord')
        return ReadRecordMapper.toEntity(config, { templateCompiler }, { tables })
    }
    if (service === 'Mailer') {
      if (action === 'SendEmail')
        return SendEmailMapper.toEntity(config, { mailer, templateCompiler, idGenerator })
    }
    if (service === 'Code') {
      if (action === 'RunJavascript')
        return RunJavascriptMapper.toEntity(config, { templateCompiler, javascriptCompiler })
    }
    if (service === 'Document') {
      if (action === 'CreateDocxFromTemplate')
        return CreateDocxFromTemplateMapper.toEntity(
          config,
          {
            templateCompiler,
            documentLoader,
            idGenerator,
            fileSystem,
          },
          { buckets }
        )
    }
    if (service === 'Spreadsheet') {
      if (action === 'CreateXlsxFromTemplate')
        return CreateXlsxFromTemplateMapper.toEntity(
          config,
          {
            templateCompiler,
            spreadsheetLoader,
            idGenerator,
            fileSystem,
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
          },
          { buckets }
        )
    }
    throw new Error(`ActionMapper: Action ${action} not supported`)
  }

  static toManyEntities(configs: Config[], services: Services, entities: Entities): Action[] {
    return configs.map((config) => this.toEntity(config, services, entities))
  }
}
