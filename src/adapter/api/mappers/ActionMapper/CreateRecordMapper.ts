import type { CreateRecord as CreateRecordConfig } from '@adapter/api/configs/Action/CreateRecord'
import { CreateRecord } from '@domain/entities/Action/CreateRecord'
import { ToCreate } from '@domain/entities/Record/ToCreate'
import type { Database } from '@domain/services/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  database: Database
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
}

export class CreateRecordMapper {
  static toEntity = (config: CreateRecordConfig, services: Services): CreateRecord => {
    const { idGenerator, database, templateCompiler } = services
    const recordToCreate = new ToCreate(config.fields, { idGenerator, templateCompiler })
    return new CreateRecord({ ...config, recordToCreate, database })
  }
}
