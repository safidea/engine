import { BaseRecord, type BaseRecordFields, type RecordFields } from './base'

export interface PersistedRecordFields extends BaseRecordFields {
  created_at: Date
  updated_at?: Date
}

export type PersistedRecordConfig = PersistedRecordFields

export class PersistedRecord extends BaseRecord {
  readonly fieldsWithDates: PersistedRecordFields

  constructor(config: PersistedRecordConfig) {
    super(config)
    this.fieldsWithDates = config
  }

  getFieldAsString(key: string): string | null {
    const value = this.fields[key]
    return value ? String(value) : null
  }

  get fields(): RecordFields {
    const { created_at, updated_at } = this.fieldsWithDates
    const json = {
      ...super.fields,
      created_at: created_at.toISOString(),
    }
    if (updated_at) json.updated_at = updated_at.toISOString()
    return json
  }
}
