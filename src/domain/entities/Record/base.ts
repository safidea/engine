export type RecordFieldValue = string | number | boolean | Date | undefined | string[]

export interface RecordFields {
  id: string
  created_at?: Date
  updated_at?: Date
  [key: string]: RecordFieldValue
}

export interface JsonRecordFields {
  id: string
  created_at?: string
  updated_at?: string
  [key: string]: string | number | boolean | undefined | string[]
}

export class BaseRecord {
  constructor(readonly fields: RecordFields) {}

  get id(): string {
    return this.fields.id
  }

  toJson(): JsonRecordFields {
    const { id, created_at, ...res } = this.fields
    return Object.entries(res).reduce(
      (acc: JsonRecordFields, [key, value]) => {
        if (value instanceof Date) acc[key] = value.toISOString()
        else acc[key] = value
        return acc
      },
      { id }
    )
  }
}
