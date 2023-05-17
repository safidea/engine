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
  private table(baseName: string, tableName: string): PrismaClientInterface {
    const table = PrismaLibrary.table(baseName, tableName)
    if (table == null) {
      throw new Error(`Table "${tableName}" does not exist in base "${baseName}"`)
    }
    return table
  }

  public baseExist(baseName: string): boolean {
    return PrismaLibrary.base(baseName) != null
  }

  public tableExist(baseName: string, tableName: string): boolean {
    return PrismaLibrary.table(baseName, tableName) != null
  }

  public addModel(baseName: string, tableName: string, modelData: PrismaModelInterface): void {
    const modelName = PrismaUtils.getModelName(tableName)
    PrismaUtils.updateModelSchema(baseName, modelName, modelData)
  }

  public initLibraries(): void {
    PrismaLibrary.init()
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
