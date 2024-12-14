import { BaseRecord, type BaseRecordFields } from './base'

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

  getFieldAsArray(key: string): string[] | null {
    const value = this.fields[key]
    if (!value) return null
    return Array.isArray(value) ? value : [value.toString()]
  }
}
