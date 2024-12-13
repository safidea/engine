export type RecordFieldValue = string | number | boolean | Date | undefined | string[]

export interface BaseRecordFields {
  id: string
  [key: string]: RecordFieldValue
}

export interface RecordFields {
  id: string
  created_at?: string
  updated_at?: string
  [key: string]: string | number | boolean | undefined | string[]
}

export class BaseRecord {
  constructor(private _baseFields: BaseRecordFields) {}

  get id(): string {
    return this._baseFields.id
  }

  get fields(): RecordFields {
    const { id, ...res } = this._baseFields
    return Object.entries(res).reduce(
      (acc: RecordFields, [key, value]) => {
        if (value instanceof Date) acc[key] = value.toISOString()
        else acc[key] = value
        return acc
      },
      { id }
    )
  }
}
