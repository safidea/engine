import type {
  DatabaseProviderInterface,
  DatabaseProviderTableInterface,
} from '../interfaces/orm.interface'

import type { DatabaseDataType } from 'shared-database'

class DatabaseService {
  private databaseProvider: DatabaseProviderInterface

  constructor({ databaseProvider }: { databaseProvider: DatabaseProviderInterface }) {
    this.databaseProvider = databaseProvider
  }

  private table(name: string): DatabaseProviderTableInterface {
    const table = this.databaseProvider.table(name)
    if (table == null) throw new Error(`Table "${name}" does not exist`)
    return table
  }

  public tableExist(name: string): boolean {
    return this.databaseProvider.table(name) != null
  }

  public getTableEnumName(table: string, field: string): string {
    return this.databaseProvider.getTableEnumName(table, field)
  }

  public async create(tableName: string, data: DatabaseDataType) {
    return this.table(tableName).create({ data })
  }

  public async createMany(tableName: string, data: DatabaseDataType[]) {
    return this.table(tableName).createMany({ data })
  }

  public async updateById(tableName: string, id: string, data: DatabaseDataType) {
    return this.table(tableName).update({
      where: { id },
      data,
    })
  }

  public async upsertById(tableName: string, id: string, data: DatabaseDataType) {
    return this.table(tableName).upsert({
      where: { id },
      create: data,
      update: data,
    })
  }

  public async readById(tableName: string, id: string) {
    return this.table(tableName).findUnique({
      where: { id },
    })
  }

  public async deleteById(tableName: string, id: string) {
    return this.table(tableName).delete({
      where: { id },
    })
  }

  public async list(tableName: string) {
    return this.table(tableName).findMany({})
  }
}

export default DatabaseService
