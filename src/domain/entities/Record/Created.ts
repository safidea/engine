import type { IdGenerator } from '@domain/services/IdGenerator'
import { Base, type BaseRecordFields, type RecordJson } from './base'

export interface CreatedRecordFields extends BaseRecordFields {
  created_at: Date
}

export type Config = Omit<BaseRecordFields, 'id'>

export interface Services {
  idGenerator: IdGenerator
}

export class CreatedRecord extends Base {
  readonly fields: CreatedRecordFields

  constructor(config: Config, services: Services) {
    const { idGenerator } = services
    const fields: CreatedRecordFields = {
      ...config,
      id: idGenerator.forRecord(),
      created_at: new Date(),
    }
    super(fields)
    this.fields = fields
  }

  toJson(): RecordJson {
    const { created_at } = this.fields
    return {
      ...super.toJson(),
      created_at: created_at.toISOString(),
    }
  }
}
