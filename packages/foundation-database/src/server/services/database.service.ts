import { PrismaLib } from '@database/server'

import type {
  DatabaseServiceFunctionType,
  DatabaseServiceFunctionIdType,
  DatabaseServiceFunctionDataType,
  DatabaseServiceFunctionListType,
  PrismaClientInterface,
} from '@database'

class DatabaseService {
  private table(baseName: string, tableName: string): PrismaClientInterface {
    return PrismaLib.table(baseName, tableName)
  }

  public baseExist(baseName: string): boolean {
    return PrismaLib.base(baseName) != null
  }

  public tableExist(baseName: string, tableName: string): boolean {
    return this.table(baseName, tableName) != null
  }

  public create: DatabaseServiceFunctionDataType = async (baseName, tableName, params) => {
    const { data } = params
    const row = await this.table(baseName, tableName).create({
      data,
    })
    return row
  }

  public patchById: DatabaseServiceFunctionType = async (baseName, tableName, params) => {
    const { data, id } = params
    const updated_at = new Date().toISOString()
    const row = await this.table(baseName, tableName).update({
      where: { id },
      data: {
        ...data,
        updated_at,
      },
    })
    return row
  }

  public putById: DatabaseServiceFunctionType = async (baseName, tableName, params) => {
    const { data, id } = params
    const updated_at = new Date().toISOString()
    const row = await this.table(baseName, tableName).update({
      where: { id },
      data: {
        ...data,
        updated_at,
      },
    })
    return row
  }

  public upsertById: DatabaseServiceFunctionType = async (baseName, tableName, params) => {
    const { data, id } = params
    const updated_at = new Date().toISOString()
    const row = await this.table(baseName, tableName).upsert({
      where: { id },
      create: data,
      update: {
        ...data,
        updated_at,
      },
    })
    return row
  }

  public readById: DatabaseServiceFunctionIdType = async (baseName, tableName, params) => {
    const { id } = params
    const row = await this.table(baseName, tableName).findUnique({
      where: { id },
    })
    return row
  }

  public list: DatabaseServiceFunctionListType = async (baseName, tableName) => {
    const rows = await this.table(baseName, tableName).findMany({})
    return rows
  }

  public deleteById: DatabaseServiceFunctionIdType = async (baseName, tableName, params) => {
    const { id } = params
    const deleted_at = new Date().toISOString()
    const row = await this.table(baseName, tableName).update({
      where: { id },
      data: {
        deleted_at,
      },
    })
    return row
  }
}

export default new DatabaseService()
