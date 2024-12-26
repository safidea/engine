export type RecordFieldValue = string | number | boolean | Date | undefined | string[]

export interface RecordFields {
  [key: string]: RecordFieldValue
}

export interface RecordFieldsConfig {
  [key: string]: string | number | boolean | undefined | string[]
}

export type UpdateRecordFields = {
  id: string
  fields: RecordFields
}

export type RecordFieldsToCreate = RecordFields & {
  id: string
  created_at: Date
}

export type RecordFieldsToUpdate = RecordFields & {
  id: string
  updated_at: Date
}

export type PersistedRecordFields = RecordFields & {
  id: string
  created_at: Date
  updated_at?: Date
}

export class Record {
  constructor(
    readonly id: string,
    readonly fields: RecordFields,
    readonly created_at: Date,
    readonly updated_at?: Date
  ) {}

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
