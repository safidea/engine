import { BaseRecord, type RecordFields } from './base'

export type UpdatedRecordFields = RecordFields

export class UpdatedRecord extends BaseRecord {
  constructor(fields: UpdatedRecordFields) {
    super({
      ...fields,
      updated_at: new Date(),
    })
  }

  get updated_at(): Date {
    if (!this.fields.updated_at) throw new Error('updated_at is required')
    return this.fields.updated_at
  }
}
