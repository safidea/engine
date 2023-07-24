import { v4 as uuidv4 } from 'uuid'

interface Fields {
  [key: string]: string | number | boolean | undefined | string[]
}

export class Record {
  constructor(
    private readonly _table: string,
    private readonly _fields: Fields,
    private readonly _id: string = uuidv4(),
    private readonly _created_time?: string,
    private readonly _last_modified_time?: string
  ) {}

  get id(): string {
    return this._id
  }

  get fields(): Fields {
    return this._fields
  }

  get created_time(): string | undefined {
    return this._created_time
  }

  get last_modified_time(): string | undefined {
    return this._last_modified_time
  }

  get table(): string {
    return this._table
  }
}
