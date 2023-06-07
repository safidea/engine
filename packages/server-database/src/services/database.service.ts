import PrismaLibrary from '../libraries/prisma.library'
import PrismaUtils from '../utils/prisma.utils'

import type {
  DatabaseServiceFunctionType,
  DatabaseServiceFunctionIdType,
  DatabaseServiceFunctionDataType,
  DatabaseServiceFunctionListType,
  DatabaseServiceFunctionReadType,
} from 'shared-database'
import type { PrismaClientInterface, PrismaModelInterface } from '../interfaces/prisma.interface'

class DatabaseService {
  private table(name: string): PrismaClientInterface {
    const table = PrismaLibrary.table(name)
    if (table == null) {
      throw new Error(`Table "${name}" does not exist`)
    }
    return table
  }

  public tableExist(name: string): boolean {
    return PrismaLibrary.table(name) != null
  }

  public addModel(tableName: string, modelData: PrismaModelInterface): void {
    const modelName = PrismaUtils.getModelName(tableName)
    PrismaUtils.updateModelSchema(modelName, modelData)
  }

  public getEnumName(table: string, field: string): string {
    return PrismaUtils.getEnumName(table, field)
  }

  public create: DatabaseServiceFunctionDataType = async (tableName, params) => {
    const { data } = params
    const row = await this.table(tableName).create({
      data,
    })
    return row
  }

  public updateById: DatabaseServiceFunctionType = async (tableName, params) => {
    const { data, id } = params
    const row = await this.table(tableName).update({
      where: { id },
      data,
    })
    return row
  }

  public upsertById: DatabaseServiceFunctionType = async (tableName, params) => {
    const { data, id } = params
    const row = await this.table(tableName).upsert({
      where: { id },
      create: data,
      update: data,
    })
    return row
  }

  public readById: DatabaseServiceFunctionReadType = async (tableName, params) => {
    const { id } = params
    const row = await this.table(tableName).findUnique({
      where: { id },
    })
    return row
  }

  public deleteById: DatabaseServiceFunctionIdType = async (tableName, params) => {
    const { id } = params
    const row = await this.table(tableName).delete({
      where: { id },
    })
    return row
  }

  public list: DatabaseServiceFunctionListType = async (tableName) => {
    const rows = await this.table(tableName).findMany({})
    return rows
  }
}

export default new DatabaseService()
