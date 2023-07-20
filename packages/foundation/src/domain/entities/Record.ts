interface Fields {
  [key: string]: string | number | boolean | string[]
}

export class Record {
  constructor(
    private readonly _table: string,
    private readonly _fields: Fields,
    private readonly _id: string,
    private readonly _created_time: string = new Date().toISOString()
  ) {}

  get id(): string {
    return this._id
  }

  get fields(): Fields {
    return this._fields
  }

  get created_time(): string {
    return this._created_time
  }

  get table(): string {
    return this._table
  }
}
