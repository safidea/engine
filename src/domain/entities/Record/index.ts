export type RecordFieldValue = string | number | boolean | Date | string[] | null | undefined

export type RecordFields = {
  [key: string]: RecordFieldValue
} & {
  id?: never
  created_at?: never
  updated_at?: never
}

export interface RecordFieldsConfig {
  [key: string]: string | number | boolean | null | string[]
}

export type UpdateRecordFields<T extends RecordFields = RecordFields> = {
  id: string
  fields: Partial<T>
}

export type RecordFieldsToCreate<T extends RecordFields = RecordFields> = {
  id: string
  created_at: Date
  fields: T
}

export type RecordFieldsToUpdate<T extends RecordFields = RecordFields> = {
  id: string
  updated_at: Date
  fields: Partial<T>
}

export type PersistedRecordFields<T extends RecordFields = RecordFields> = {
  id: string
  created_at: Date
  updated_at?: Date
  fields: T
}

export class Record<T extends RecordFields = RecordFields> {
  constructor(
    readonly id: string,
    readonly fields: T,
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
