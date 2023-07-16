type Database = {
  [key: string]: {
    [key: string]: string | number | boolean
  }[]
}

export class InmemoryOrm {
  private db: Database = {}

  async create(collection: string, data: any): Promise<any> {
    if (!this.db[collection]) this.db[collection] = []
    this.db[collection].push(data)
    return data
  }
}
