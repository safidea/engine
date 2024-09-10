export type RecordFieldType = string | number | boolean | Date | undefined | string[]

export interface BaseRecordFields {
  id: string
  [key: string]: RecordFieldType
}

export interface RecordJson {
  id: string
  created_at?: string
  updated_at?: string
  [key: string]: string | number | boolean | undefined | string[]
}

export class Base {
  constructor(private _baseFields: BaseRecordFields) {}

  get id(): string {
    return this._baseFields.id
  }

  toJson(): RecordJson {
    const { id, ...res } = this._baseFields
    return Object.entries(res).reduce(
      (acc: RecordJson, [key, value]) => {
        if (value instanceof Date) acc[key] = value.toISOString()
        else acc[key] = value
        return acc
      },
      { id }
    )
  }
}
