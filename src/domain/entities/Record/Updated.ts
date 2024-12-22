import { BaseRecord, type BaseRecordFields } from './base'

export interface UpdatedRecordFields extends BaseRecordFields {
  updated_at: Date
}

export type UpdatedRecordConfig = BaseRecordFields

export class UpdatedRecord extends BaseRecord {
  readonly fieldsWithDates: UpdatedRecordFields

  constructor(config: UpdatedRecordConfig) {
    const fields: UpdatedRecordFields = {
      ...config,
      updated_at: new Date(),
    }
    super(fields)
    this.fieldsWithDates = fields
  }
}
