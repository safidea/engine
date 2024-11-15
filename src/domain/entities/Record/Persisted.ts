import { BaseRecord, type BaseRecordFields, type RecordJson } from './base'

export interface PersistedRecordFields extends BaseRecordFields {
  created_at: Date
  updated_at?: Date
}

export type PersistedRecordConfig = PersistedRecordFields

export class PersistedRecord extends BaseRecord {
  readonly fields: PersistedRecordFields

  constructor(config: PersistedRecordConfig) {
    super(config)
    this.fields = config
  }

  toJson(): RecordJson {
    const { created_at, updated_at } = this.fields
    const json = {
      ...super.toJson(),
      created_at: created_at.toISOString(),
    }
    if (updated_at) json.updated_at = updated_at.toISOString()
    return json
  }
}
