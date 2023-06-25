import type {
  OrmProviderTablesInterface,
  OrmProviderTableInterface,
  OrmProviderInterface,
} from '../interfaces/orm.interface'

import type { DatabaseDataType } from 'shared-database'

class DatabaseService {
  private orm: OrmProviderTablesInterface
  private ormProvider: OrmProviderInterface

  constructor({
    orm,
    ormProvider,
  }: {
    orm: OrmProviderTablesInterface
    ormProvider: OrmProviderInterface
  }) {
    this.orm = orm
    this.ormProvider = ormProvider
  }

  private table(name: string): OrmProviderTableInterface {
    return this.ormProvider.getTable(name, this.orm)
  }

  public tableExist(name: string): boolean {
    return name in this.orm
  }

  public getTableEnumName(table: string, field: string): string {
    return this.ormProvider.getTableEnumName(table, field)
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
