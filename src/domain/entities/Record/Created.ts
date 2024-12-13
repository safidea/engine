import type { IdGenerator } from '@domain/services/IdGenerator'
import { BaseRecord, type BaseRecordFields, type RecordFields } from './base'

export interface CreatedRecordFields extends BaseRecordFields {
  created_at: Date
}

export type CreatedRecordConfig = Omit<BaseRecordFields, 'id'>

export interface CreatedRecordServices {
  idGenerator: IdGenerator
}

export class CreatedRecord extends BaseRecord {
  readonly fieldsWithDates: CreatedRecordFields

  constructor(config: CreatedRecordConfig, services: CreatedRecordServices) {
    const { idGenerator } = services
    const fields: CreatedRecordFields = {
      ...config,
      id: idGenerator.forRecord(),
      created_at: new Date(),
    }
    super(fields)
    this.fieldsWithDates = fields
  }

  get fields(): RecordFields {
    const { created_at } = this.fieldsWithDates
    return {
      ...super.fields,
      created_at: created_at.toISOString(),
    }
  }
}
