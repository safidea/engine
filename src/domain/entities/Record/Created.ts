import type { IdGenerator } from '@domain/services/IdGenerator'
import { BaseRecord, type BaseRecordFields, type RecordJson } from './base'

export interface CreatedRecordFields extends BaseRecordFields {
  created_at: Date
}

export type CreatedRecordConfig = Omit<BaseRecordFields, 'id'>

export interface CreatedRecordServices {
  idGenerator: IdGenerator
}

export class CreatedRecord extends BaseRecord {
  readonly fields: CreatedRecordFields

  constructor(config: CreatedRecordConfig, services: CreatedRecordServices) {
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
