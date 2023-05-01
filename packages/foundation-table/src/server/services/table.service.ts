import { DatabaseService } from '@database/server'

import type {
  DatabaseServiceFunctionType,
  DatabaseServiceFunctionDataType,
  DatabaseServiceFunctionIdType,
  DatabaseServiceFunctionListType,
  DatabaseServiceFunctionReadType,
} from '@database'

class TableService {
  public create: DatabaseServiceFunctionDataType = async (baseName, tableName, params) => {
    return DatabaseService.create(baseName, tableName, params)
  }

  public read: DatabaseServiceFunctionReadType = async (baseName, tableName, params) => {
    return DatabaseService.readById(baseName, tableName, params)
  }

  public update: DatabaseServiceFunctionType = async (baseName, tableName, params) => {
    params.data.updated_at = new Date().toISOString()
    return DatabaseService.updateById(baseName, tableName, params)
  }

  public delete: DatabaseServiceFunctionIdType = async (baseName, tableName, params) => {
    const data = { deleted_at: new Date().toISOString() }
    return DatabaseService.updateById(baseName, tableName, { ...params, data })
  }

  public list: DatabaseServiceFunctionListType = async (baseName, tableName) => {
    return DatabaseService.list(baseName, tableName)
  }
}

export default new TableService()
