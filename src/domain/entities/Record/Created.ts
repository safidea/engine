import type { IdGenerator } from '@domain/services/IdGenerator'
import { BaseRecord, type RecordFields } from './base'

export type CreatedRecordFields = Omit<RecordFields, 'id'>

export interface CreatedRecordServices {
  idGenerator: IdGenerator
}

export class CreatedRecord extends BaseRecord {
  constructor(fields: CreatedRecordFields, services: CreatedRecordServices) {
    const { idGenerator } = services
    super({
      ...fields,
      id: idGenerator.forRecord(),
      created_at: new Date(),
    })
  }

  get created_at(): Date {
    if (!this.fields.created_at) throw new Error('created_at is required')
    return this.fields.created_at
  }
}
