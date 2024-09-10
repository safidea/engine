import { Base, type BaseRecordFields, type RecordJson } from './base'

export interface UpdatedRecordFields extends BaseRecordFields {
  updated_at: Date
}

export type Config = BaseRecordFields

export class UpdatedRecord extends Base {
  readonly fields: UpdatedRecordFields

  constructor(config: Config) {
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
