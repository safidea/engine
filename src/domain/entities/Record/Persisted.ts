import { Base, type BaseRecordFields, type RecordJson } from './base'

export interface PersistedRecordFields extends BaseRecordFields {
  created_at: Date
  updated_at?: Date
}

export type Config = PersistedRecordFields

export class PersistedRecord extends Base {
  readonly fields: PersistedRecordFields

  constructor(config: Config) {
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
