import { DatabaseService } from 'server-database'

import type {
  DatabaseServiceFunctionType,
  DatabaseServiceFunctionDataType,
  DatabaseServiceFunctionIdType,
  DatabaseServiceFunctionListType,
  DatabaseServiceFunctionReadType,
} from 'shared-database'

class TableService {
  public create: DatabaseServiceFunctionDataType = async (tableName, params) => {
    return DatabaseService.create(tableName, params)
  }

  public read: DatabaseServiceFunctionReadType = async (tableName, params) => {
    return DatabaseService.readById(tableName, params)
  }

  public update: DatabaseServiceFunctionType = async (tableName, params) => {
    params.data.updated_at = new Date().toISOString()
    return DatabaseService.updateById(tableName, params)
  }

  public delete: DatabaseServiceFunctionIdType = async (tableName, params) => {
    const data = { deleted_at: new Date().toISOString() }
    return DatabaseService.updateById(tableName, { ...params, data })
  }

  public list: DatabaseServiceFunctionListType = async (tableName) => {
    return DatabaseService.list(tableName)
  }
}

export default new TableService()
