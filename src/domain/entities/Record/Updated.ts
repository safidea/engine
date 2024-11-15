import { BaseRecord, type BaseRecordFields, type RecordJson } from './base'

export interface UpdatedRecordFields extends BaseRecordFields {
  updated_at: Date
}

export type UpdatedRecordConfig = BaseRecordFields

export class UpdatedRecord extends BaseRecord {
  readonly fields: UpdatedRecordFields

  constructor(config: UpdatedRecordConfig) {
    const fields: UpdatedRecordFields = {
      ...config,
      updated_at: new Date(),
    }
    super(fields)
    this.fields = fields
  }

  toJson(): RecordJson {
    const { updated_at } = this.fields
    return {
      ...super.toJson(),
      updated_at: updated_at.toISOString(),
    }
  }
}
