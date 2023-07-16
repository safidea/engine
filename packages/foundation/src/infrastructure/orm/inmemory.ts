interface Data {
  [key: string]: string | number | boolean
}

interface Database {
  [key: string]: Data[]
}

export class InmemoryOrm {
  private db: Database = {}

  async create(table: string, data: Data): Promise<Data> {
    if (!this.db[table]) this.db[table] = []
    this.db[table].push(data)
    return data
  }
}
