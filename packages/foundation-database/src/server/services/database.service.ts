import PrismaLib from '@database/server/lib/prisma.lib'

import type {
  DatabaseServiceFunctionType,
  DatabaseServiceFunctionIdType,
  DatabaseServiceFunctionDataType,
  DatabaseServiceFunctionListType,
  DatabaseServiceFunctionReadType,
  PrismaClientInterface,
} from '@database'

class DatabaseService {
  private table(baseName: string, tableName: string): PrismaClientInterface {
    const table = PrismaLib.table(baseName, tableName)
    if (table == null) {
      throw new Error(`Table "${tableName}" does not exist in base "${baseName}"`)
    }
    return table
  }

  public baseExist(baseName: string): boolean {
    return PrismaLib.base(baseName) != null
  }

  public tableExist(baseName: string, tableName: string): boolean {
    return PrismaLib.table(baseName, tableName) != null
  }

  public create: DatabaseServiceFunctionDataType = async (baseName, tableName, params) => {
    const { data } = params
    const row = await this.table(baseName, tableName).create({
      data,
    })
    return row
  }

  public updateById: DatabaseServiceFunctionType = async (baseName, tableName, params) => {
    const { data, id } = params
    const row = await this.table(baseName, tableName).update({
      where: { id },
      data,
    })
    return row
  }

  public upsertById: DatabaseServiceFunctionType = async (baseName, tableName, params) => {
    const { data, id } = params
    const row = await this.table(baseName, tableName).upsert({
      where: { id },
      create: data,
      update: data,
    })
    return row
  }

  public readById: DatabaseServiceFunctionReadType = async (baseName, tableName, params) => {
    const { id } = params
    const row = await this.table(baseName, tableName).findUnique({
      where: { id },
    })
    return row
  }

  public deleteById: DatabaseServiceFunctionIdType = async (baseName, tableName, params) => {
    const { id } = params
    const row = await this.table(baseName, tableName).delete({
      where: { id },
    })
    return row
  }

  public list: DatabaseServiceFunctionListType = async (baseName, tableName) => {
    const rows = await this.table(baseName, tableName).findMany({})
    return rows
  }
}

export default new DatabaseService()
