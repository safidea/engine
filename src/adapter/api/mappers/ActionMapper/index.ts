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
import { CreatePdfFromHtmlTemplateMapper } from './browser/CreatePdfFromHtmlTemplateMapper'
import type { Browser } from '@domain/services/Browser'
import type { FileSystem } from '@domain/services/FileSystem'
import { File } from '@domain/entities/File'
import type { Storage } from '@domain/services/Storage'
import type { Server } from '@domain/services/Server'

interface Services {
  mailer: Mailer
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  javascriptCompiler: JavascriptCompiler
  browser: Browser
  fileSystem: FileSystem
  storage: Storage
  server: Server
}

interface Entities {
  tables: Table[]
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
      fileSystem,
      storage,
      server,
    } = services
    const { tables } = entities
    const file = new File({ idGenerator, server })
    if (service === 'Database') {
      if (action === 'CreateRecord')
        return CreateRecordMapper.toEntity(config, { idGenerator, templateCompiler }, { tables })
    }
    if (service === 'Mailer') {
      if (action === 'SendEmail')
        return SendEmailMapper.toEntity(config, { mailer, templateCompiler })
    }
    if (service === 'Code') {
      if (action === 'RunJavascript')
        return RunJavascriptMapper.toEntity(config, { templateCompiler, javascriptCompiler })
    }
    if (service === 'Browser') {
      if (action === 'CreatePdfFromHtmlTemplate')
        return CreatePdfFromHtmlTemplateMapper.toEntity(config, {
          browser,
          templateCompiler,
          fileSystem,
          file,
          storage,
        })
    }
    throw new Error(`ActionMapper: Action ${action} not supported`)
  }

  static toManyEntities(configs: Config[], services: Services, entities: Entities): Action[] {
    return configs.map((config) => this.toEntity(config, services, entities))
  }
}
