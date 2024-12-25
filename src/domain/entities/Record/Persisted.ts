import { BaseRecord, type RecordFields } from './base'

export type PersistedRecordFields = RecordFields

export class PersistedRecord extends BaseRecord {
  constructor(fields: PersistedRecordFields) {
    super(fields)
  }

  get created_at(): Date {
    if (!this.fields.created_at) throw new Error('created_at is required')
    return this.fields.created_at
  }

  get updated_at(): Date | undefined {
    return this.fields.updated_at
  }

  getFieldAsString(key: string): string | null {
    const value = this.fields[key]
    if (!value) return null
    return typeof value === 'string' ? value : value.toString()
  }

  getFieldAsDate(key: string): Date | null {
    const value = this.fields[key]
    if (!value) return null
    return value instanceof Date ? value : new Date(value.toString())
  }

  getFieldAsNumber(key: string): number | null {
    const value = this.fields[key]
    if (!value) return null
    return typeof value === 'number' ? value : parseFloat(value.toString())
  }

  getFieldAsBoolean(key: string): boolean | null {
    const value = this.fields[key]
    if (!value) return null
    return typeof value === 'boolean' ? value : !!value
  }
}
