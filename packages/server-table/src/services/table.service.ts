import { DatabaseService } from 'server-database'

import type { DatabaseDataType } from 'shared-database'

class TableService {
  private databaseService: DatabaseService

  constructor({ databaseService }: { databaseService: DatabaseService }) {
    this.databaseService = databaseService
  }

  public async create(table: string, data: DatabaseDataType) {
    return this.databaseService.create(table, data)
  }

  public async createMany(table: string, data: DatabaseDataType[]) {
    return this.databaseService.createMany(table, data)
  }

  public async read(table: string, id: string) {
    return this.databaseService.readById(table, id)
  }

  public async update(table: string, id: string, data: DatabaseDataType) {
    data.updated_at = new Date().toISOString()
    return this.databaseService.updateById(table, id, data)
  }

  public async delete(table: string, id: string) {
    const data = { deleted_at: new Date().toISOString() }
    return this.databaseService.updateById(table, id, data)
  }

  public async list(table: string) {
    return this.databaseService.list(table)
  }
}

export default TableService
